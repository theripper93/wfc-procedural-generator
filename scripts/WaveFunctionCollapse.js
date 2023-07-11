// Create a wave function collapse solver


export class WaveFunctionSolver{
    constructor (dataset = sampleDataset, width, height, depth) {
        this.dataset = dataset;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this._failedTiles = Infinity;
        this.init();
    }

    init() {
        this.grid = new Grid3(this.width, this.height, this.depth);
        this.grid.traverse((x, y, z, cell) => cell.possible = [...this.dataset]);
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
        return this;
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

    async createTile(x, y, z, cell) {
        if (!cell.value?.asset) return;
        const tile = cell.value;
        const rotation = tile.rotation;
        const assets = Array.isArray(tile.asset) ? tile.asset : [tile.asset];
        for (const asset of assets) {            
            const tileData = {
                x: x * canvas.grid.size + this._build.x,
                y: y * canvas.grid.size + this._build.y,
                width: canvas.grid.size,
                height: canvas.grid.size,
                rotation: rotation,
                flags: {
                    "levels-3d-preview": {
                        model3d: asset,
                        depth: canvas.grid.size,
                        autoCenter: true,
                    }
                },
            }
            this._buildQueue.push(tileData);
        }
    }

    static fromDialog(offset = {x: canvas.scene.dimensions.sceneX, y: canvas.scene.dimensions.sceneY}, width, height, depth) {
        const wfc = new WaveFunctionSolver(undefined, width, height, depth);
        let preventClose = false;
        const d = new Dialog({
            title: "Wave Function Collapse",
            content: `Select the tiles you want to learn from, then click Learn Pattern. After that, click Collapse to generate the tiles.`,
            buttons: {
                learn: {
                    label: '<i class="fas fa-graduation-cap"></i> Learn Pattern',
                    callback: () => {
                        preventClose = true;
                        wfc.learn();
                    }
                },
                collapse: {
                    label: '<i class="fa-regular fa-arrows-minimize"></i> Collapse',
                    callback: () => {
                        wfc.collapse(offset);
                    }
                },
            },
            default: "learn",
        })
        const oldClose = d.close;
        d.close = async function () {
            if (preventClose) {
                preventClose = false;
                return;
            }
            await oldClose.bind(this)();
        }
        d.render(true);
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

const sampleDataset = [
    {
        id: "WallHT",
        exclude: {
            up: ["WallHT"],
            down: ["WallHT"],
        },
        asset: "modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/wall-tiles/1x1-wall-straight.glb",
        rotation: 0,
        weight: 1,
        "sockets": {
            left: ["wHT"],
            right: ["wHT"],
            up: [0, "bookcase"],
            down: [0],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "WallHB",
        exclude: {
            up: ["WallHB"],
            down: ["WallHB"],
        },
        asset: "modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/wall-tiles/1x1-wall-straight.glb",
        rotation: 180,
        weight: 1,
        "sockets": {
            left: ["wHB"],
            right: ["wHB"],
            up: [0],
            down: [0],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "WallVR",
        exclude: {
            left: ["WallVR"],
            right: ["WallVR"],
        },
        asset: "modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/wall-tiles/1x1-wall-straight.glb",
        rotation: 90,
        weight: 1,
        "sockets": {
            left: [0],
            right: [0],
            up: ["wVR"],
            down: ["wVR"],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "WallVL",
        exclude: {
            left: ["WallVL"],
            right: ["WallVL"],
        },
        asset: "modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/wall-tiles/1x1-wall-straight.glb",
        rotation: 270,
        weight: 1,
        "sockets": {
            left: [0],
            right: [0],
            up: ["wVL"],
            down: ["wVL"],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "RoadCornerRD",
        asset: "modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/wall-tiles/1x1-wall-corner.glb",
        rotation: 0,
        weight: 0.2,
        "sockets": {
            left: [0],
            right: ["wHT"],
            up: [0],
            down: ["wVL"],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "RoadCornerLD",
        asset: "modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/wall-tiles/1x1-wall-corner.glb",
        rotation: 90,
        weight: 0.2,
        "sockets": {
            left: ["wHT"],
            right: [0],
            up: [0],
            down: ["wVR"],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "RoadCornerLU",
        asset: "modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/wall-tiles/1x1-wall-corner.glb",
        rotation: 180,
        weight: 0.2,
        "sockets": {
            left: ["wHD"],
            right: [0],
            up: ["wVR"],
            down: [0],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "RoadCornerRU",
        asset: "modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/wall-tiles/1x1-wall-corner.glb",
        rotation: 270,
        weight: 0.2,
        "sockets": {
            left: [0],
            right: ["wHD"],
            up: ["wVL"],
            down: [0],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "bookcase",
        asset: ["modules/canvas3dcompendium/assets/Tiles/Medieval%20Dungeon/Cobweb.glb","modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/floor-tiles/1x1-floor.glb"],
        rotation: 180,
        weight: 0.05,
        "sockets": {
            left: [0],
            right: [0],
            up: [0],
            down: ["bookcase"],
            top: [0],
            bottom: [0],
        }
    },
    {
        id: "empty",
        asset: "modules/baileywiki-3d/models/maps-modular/weathered-tileset/cracked/floor-tiles/1x1-floor.glb",
        rotation: 0,
        weight: 10,
        "sockets": {
            left: [0],
            right: [0],
            up: [0],
            down: [0],
            top: [0],
            bottom: [0],
        }
    }
]

const sampleDataset1 = [
    {
        id: "RoadH",
        asset: "modules/canvas3dcompendium/assets/Tiles/KayKitPack/Medieval%20Builder/tiles/square/square_rock_roadB_detail.glb",
        rotation: 90,
        weight: 1,
        "sockets": {
            left: ["wH"],
            right: ["wH"],
            up: [0],
            down: [0],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "RoadV",
        asset: "modules/canvas3dcompendium/assets/Tiles/KayKitPack/Medieval%20Builder/tiles/square/square_rock_roadB_detail.glb",
        rotation: 0,
        weight: 1,
        "sockets": {
            left: [0],
            right: [0],
            up: ["wV"],
            down: ["wV"],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "RoadCornerRD",
        asset: "modules/canvas3dcompendium/assets/Tiles/KayKitPack/Medieval%20Builder/tiles/square/square_rock_roadC.glb",
        rotation: 0,
        weight: 0.1,
        "sockets": {
            left: [0],
            right: ["wH"],
            up: [0],
            down: ["wV"],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "RoadCornerLD",
        asset: "modules/canvas3dcompendium/assets/Tiles/KayKitPack/Medieval%20Builder/tiles/square/square_rock_roadC.glb",
        rotation: 90,
        weight: 0.1,
        "sockets": {
            left: ["wH"],
            right: [0],
            up: [0],
            down: ["wV"],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "RoadCornerLU",
        asset: "modules/canvas3dcompendium/assets/Tiles/KayKitPack/Medieval%20Builder/tiles/square/square_rock_roadC.glb",
        rotation: 180,
        weight: 0.1,
        "sockets": {
            left: ["wH"],
            right: [0],
            up: ["wV"],
            down: [0],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "RoadCornerRU",
        asset: "modules/canvas3dcompendium/assets/Tiles/KayKitPack/Medieval%20Builder/tiles/square/square_rock_roadC.glb",
        rotation: 270,
        weight: 0.1,
        "sockets": {
            left: [0],
            right: ["wH"],
            up: ["wV"],
            down: [0],
            top: [0],
            bottom: [0]
        }
    },
    {
        id: "empty",
        asset: "modules/canvas3dcompendium/assets/Tiles/KayKitPack/Medieval%20Builder/tiles/square/square_rock.glb",
        rotation: 0,
        weight: 20,
        "sockets": {
            left: [0],
            right: [0],
            up: [0],
            down: [0],
            top: [0],
            bottom: [0],
        }
    }
]