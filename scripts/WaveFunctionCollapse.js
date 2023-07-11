// Create a wave function collapse solver


export class WaveFunctionSolver{
    constructor (dataset, width, height, depth, padding) {
        this.dataset = dataset;
        this.padding = padding;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this._failedTiles = Infinity;
        this.init();
    }

    init() {
        this.grid = new Grid3(this.width, this.height, this.depth);
        this.grid.traverse((x, y, z, cell) => cell.possible = [...this.dataset]);
        if (this.padding) {
            const paddingBlock = {
                id: this.padding,
                asset: null,
                rotation: 0,
                weight: 0,
                sockets: {
                    left: [this.padding],
                    right: [this.padding],
                    up: [this.padding],
                    down: [this.padding],
                    top: [],
                    bottom: []
                }
            }
            for (let x = 0; x < this.width; x++) {
                this.grid.get(x, 0, 0).value = paddingBlock;
                this.grid.get(x, 0, 0).possible = [];
                this.grid.get(x, this.height - 1, 0).value = paddingBlock;
                this.grid.get(x, this.height - 1, 0).possible = [];
            }
            for (let y = 0; y < this.height; y++) {
                this.grid.get(0, y, 0).value = paddingBlock;
                this.grid.get(0, y, 0).possible = [];
                this.grid.get(this.width - 1, y, 0).value = paddingBlock;
                this.grid.get(this.width - 1, y, 0).possible = [];
            }
        }
        this.stack = [];
        this._buildQueue = [];
        this._first = true;
    }
    
    learn(tiles = canvas.tiles.controlled) {
        this.dataset = [];
        for (const tile of tiles) {
            const tileDocument = tile.document;
            const asset = tileDocument.getFlag("levels-3d-preview", "model3d");
            const rotation = tileDocument.rotation;
            const weight = 0;
            const center = tile.center;
            const neighbors = {
                left: tiles.find(t => t.center.x == center.x - canvas.grid.size && t.center.y == center.y),
                right: tiles.find(t => t.center.x == center.x + canvas.grid.size && t.center.y == center.y),
                up: tiles.find(t => t.center.x == center.x && t.center.y == center.y - canvas.grid.size),
                down: tiles.find(t => t.center.x == center.x && t.center.y == center.y + canvas.grid.size),
            }
            const tileDataset = this.dataset.find(d => d.asset == asset && d.rotation == rotation) ?? {
                id: asset + rotation, asset, rotation, weight, sockets: {
                    left: [],
                    right: [],
                    up: [],
                    down: [],
                    top: [],
                    bottom: [],
                },
                allow: {
                    left: [],
                    right: [],
                    up: [],
                    down: [],
                    top: [],
                    bottom: [],
                }
            };
            for (const [key, value] of Object.entries(neighbors)) {
                if (!value) continue;
                const neighborData = {
                    asset: value?.document.getFlag("levels-3d-preview", "model3d"),
                    rotation: value?.document.rotation,
                }
                const socketkey = neighborData.asset + neighborData.rotation;
                if (!tileDataset.sockets[key].includes(socketkey)) tileDataset.sockets[key].push(socketkey);
                if (!tileDataset.allow[key].includes(socketkey)) tileDataset.allow[key].push(socketkey);
            }
            if(!this.dataset.includes(tileDataset)) this.dataset.push(tileDataset);
        }
        for (const tileDataset of this.dataset) {
            for (const tile of tiles) {
                const socketKey = tileDataset.asset + tileDataset.rotation;
                const tileKey = tile.document.getFlag("levels-3d-preview", "model3d") + tile.document.rotation;
                if(socketKey == tileKey) tileDataset.weight++;
            }
        }
        this.grid.traverse((x, y, z, cell) => cell.possible = [...this.dataset]);
        ui.notifications.info("Wave Function Collapse | Learned " + this.dataset.length + " tiles.");
        return this;
    }

    static learnPrefabs(tokens = canvas.tokens.controlled, blockSize = 1) {
        const dataset = [];
        for (const token of tokens) {
            const document = token.document;
            const asset = document.name;
            const rotation = document.rotation;
            const weight = 0;
            const center = token.center;
            const offset = blockSize * canvas.grid.size;
            const neighbors = {
                left: tokens.find(t => t.center.x == center.x - offset && t.center.y == center.y),
                right: tokens.find(t => t.center.x == center.x + offset && t.center.y == center.y),
                up: tokens.find(t => t.center.x == center.x && t.center.y == center.y - offset),
                down: tokens.find(t => t.center.x == center.x && t.center.y == center.y + offset),
            }
            const tokenDataset = dataset.find(d => d.asset == asset && d.rotation == rotation) ?? {
                id: asset + rotation, asset, rotation, weight, sockets: {
                    left: [],
                    right: [],
                    up: [],
                    down: [],
                    top: [],
                    bottom: [],
                },
                allow: {
                    left: [],
                    right: [],
                    up: [],
                    down: [],
                    top: [],
                    bottom: [],
                }
            };
            for (const [key, value] of Object.entries(neighbors)) {
                if (!value) continue;
                const neighborData = {
                    asset: value?.document.name,
                    rotation: value?.document.rotation,
                }
                const socketkey = neighborData.asset + neighborData.rotation;
                if (!tokenDataset.sockets[key].includes(socketkey)) tokenDataset.sockets[key].push(socketkey);
                if (!tokenDataset.allow[key].includes(socketkey)) tokenDataset.allow[key].push(socketkey);
            }
            if(!dataset.includes(tokenDataset)) dataset.push(tokenDataset);
        }
        for (const tokenDataset of dataset) {
            for (const token of tokens) {
                const socketKey = tokenDataset.asset + tokenDataset.rotation;
                const tokenKey = token.document.name + token.document.rotation;
                if(socketKey == tokenKey) tokenDataset.weight++;
            }
        }
        ui.notifications.info("Wave Function Collapse | Learned " + dataset.length + " tiles.");
        return dataset;
    }

    isCollapsed() {
        let nSolved = 0;
        this.grid.traverse((x, y, z, cell) => {
            if (cell.value || !cell.possible.length) nSolved++;
        });
        return nSolved === this.grid.data.length;
    }

    collapse(build = false, iterations = 100) {
        this._build = build;
        this._iterations = iterations;
        this._currentIteration = 0;
        if (this._build == true) this._build = {x: 0, y: 0, z: 0}
        ui.notifications.info("Wave function is collapsing, please wait...");
        while (this._currentIteration < this._iterations) {
            this._bestBuildQueue = this._buildQueue;
            this.init();
            this._currentIteration++;
            while (!this.isCollapsed()) {
                this.iterate();
            }
            const failed = this.grid.data.filter((cell) => !cell.value).length;
            if (failed < this._failedTiles) {
                this._failedTiles = failed;
                this._bestBuildQueue = this._buildQueue;
            }
            console.log("Attempt " + this._currentIteration + " failed " + failed + " tiles");
            if (failed === 0) break;
        }
        if (this._build) this.build();
        ui.notifications.info("Wave Function Collapse | Collapsed in " + this._currentIteration + " iterations")
        return this._bestBuildQueue;
    }

    iterate() {
        const coords = this.getLowestEntropyCell();
        this.collapseAt(coords.x, coords.y, coords.z);
        this.propagate(coords);
    }

    getLowestEntropyCell() {
        if (this._first) {
            this._first = false;
            return {x: Math.floor(Math.random() * this.width), y: Math.floor(Math.random() * this.height), z: Math.floor(Math.random() * this.depth)}
        }
        let lowestEntropy = Infinity;
        let lowestEntropyCells = [];
        this.grid.traverse((x, y, z, cell) => {
            if (cell.value || !cell.possible.length) return;
            const entropy = this.getEntropy(x, y, z);
            if (entropy < lowestEntropy) {
                lowestEntropy = entropy;
                lowestEntropyCells = [];
            }
            if (entropy === lowestEntropy) {
                lowestEntropyCells.push({x, y, z});
            }
        });
        return lowestEntropyCells[Math.floor(Math.random() * lowestEntropyCells.length)];
    }

    getEntropy(x, y, z) {
        const cell = this.grid.get(x, y, z);
        if (cell.value) return 0;
        return Math.log2(cell.possible.length);
    }

    removeImpossible(x, y, z) {
        const cell = this.grid.get(x, y, z);
        const neighbors = this.grid.getNeighbors(x, y, z);
        const prevLength = cell.possible.length;
        cell.possible = cell.possible.filter((tile) => {
            return this.filterPossible(tile, neighbors);
        });
        return prevLength !== cell.possible.length;
    }

    filterPossible(tile, neighbors) {
        for (const [socketId, neighbor] of Object.entries(neighbors)) {
            if (!neighbor?.value) continue;
            const matchingSocket = this.getMatchingSocket(socketId);
            if (!tile.sockets[socketId].some((s) => neighbor.value.sockets[matchingSocket].includes(s))) return false;
            if (tile.exclude?.[socketId]?.includes(neighbor.value.id)) return false;
            if (tile.allow && !tile.allow?.[socketId]?.includes(neighbor.value.id)) return false;
        }
        return true;
    }

    getMatchingSocket(socketId) {
        if (socketId == "left") return "right";
        if (socketId == "right") return "left";
        if (socketId == "up") return "down";
        if (socketId == "down") return "up";
        if (socketId == "top") return "bottom";
        if (socketId == "bottom") return "top";
    }

    collapseAt(x, y, z) {
        const cell = this.grid.get(x, y, z);
        this.removeImpossible(x, y, z);
        if (cell.value) return;
        const possible = cell.possible;
        let tile;
        if (!possible.length) {
            tile = {asset: null, rotation: 0, weight: 1, sockets: {left: [], right: [], up: [], down: [], top: [], bottom: []}}
        } else {            
            const weights = possible.map((tile) => tile.weight);
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            const random = Math.random() * totalWeight;
            let sum = 0;
            for (let i = 0; i < possible.length; i++) {
                sum += weights[i];
                if (random < sum) {
                    tile = possible[i];
                    break;
                }
            }
        }
        cell.value = tile;
        this._buildQueue.push({x, y, z, ...cell});
        if (this._build) this.createTile(x, y, z, cell);
    }

    propagate(coords) {
        this.stack.push(coords);
        while (this.stack.length > 0) {
            const {x, y, z} = this.stack.pop();
            const neighbors = this.grid.getNeighbors(x, y, z);
            for (const neighbor of Object.values(neighbors)) {
                if (!neighbor || neighbor.value) continue;
                const c = this.grid.getXYZ(neighbor);
                if (this.removeImpossible(c.x, c.y, c.z)) {
                    this.stack.push({x: c.x, y: c.y, z: c.z});
                }
            }
        }
    }

    async build() {
        for(const tileData of this._bestBuildQueue) {
            canvas.scene.createEmbeddedDocuments("Tile", [tileData]);
        }
        //this.grid.traverse(this.createTile.bind(this));
    }

}





// 3D Grid class

class Grid3{
    constructor (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.data = new Array(x * y * z);
        for(let i = 0; i < this.data.length; i++) this.data[i] = {possible: [], value: null}
    }

    get(x, y, z) {
        return this.data[x + y * this.x + z * this.x * this.y];
    }

    getXYZ(cell) {
        const index = this.data.indexOf(cell);
        const x = index % this.x;
        const y = Math.floor(index / this.x) % this.y;
        const z = Math.floor(index / this.x / this.y);
        return {x, y, z};
    }

    getNeighbors(x, y, z) {
        const neighbors = {
            left: this.get(x - 1, y, z),
            right: this.get(x + 1, y, z),
            up: this.get(x, y - 1, z),
            down: this.get(x, y + 1, z),
            top: this.get(x, y, z - 1),
            bottom: this.get(x, y, z + 1),
        }
        return neighbors;
    }

    set(x, y, z, value) {
        this.data[x + y * this.x + z * this.x * this.y] = value;
    }

    traverse(callback) {
        for (let z = 0; z < this.z; z++) {
            for (let y = 0; y < this.y; y++) {
                for (let x = 0; x < this.x; x++) {
                    callback(x, y, z, this.get(x, y, z));
                }
            }
        }
    }
}