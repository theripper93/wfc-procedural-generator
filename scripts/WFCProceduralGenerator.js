import {WFCApp} from "./app.js";
import {WaveFunctionSolver} from "./WaveFunctionCollapse.js";

export class WFCProceduralGenerator{

    constructor(){
        this.packs = {};
        this.WaveFunctionSolver = WaveFunctionSolver;
    }

    registerPack(packId, packData) {
        if (packData.computeRotated) {
            const angles = [90, 180, 270];
            for (const gen of packData.generators) {
                const newDataset = [];
                for (const item of gen.dataset) {
                    
                    newDataset.push(item);
                    for (const angle of angles) {
                        const newItem = JSON.parse(JSON.stringify(item));
                        newItem.id = `${item.id} | ${angle}`;
                        newItem.rotation = angle;
                        newItem.sockets = WFCProceduralGenerator.rotateSockets(newItem.sockets, angle);
                        newDataset.push(newItem);
                    }
                }
                gen.dataset = newDataset;
                gen.description = game.i18n.localize(gen.description);
                gen.name = game.i18n.localize(gen.name);
            }
        }
        packData.id = packId;
        this.packs[packId] = packData;
    }

    openApp() {
        new WFCApp(this.packs).render(true);
    }

    learn() {
        
    }

    validate(data) {
        return data.dataset.every((item) => game.actors.getName(item.asset));
    }

    getMissing(data) {
        return data.dataset.filter((item) => !game.actors.getName(item.asset));
    }

    generate(data) {
        const blockSize = data.blockSize;
        const {sceneWidth, sceneHeight, size} = canvas.scene.dimensions;
        const pxBlockSize = blockSize * size;
        const widthBlocks = Math.floor(sceneWidth / pxBlockSize);
        const heightBlocks = Math.floor(sceneHeight / pxBlockSize);
        const solver = new WaveFunctionSolver(data.dataset, widthBlocks + (data.padding ? 2 : 0), heightBlocks + (data.padding ? 2 : 0), 1, data.padding);
        const bestResult = solver.collapse(false, data.iterations ?? 100);
        this.buildScene(bestResult, blockSize, data.padding);
    }

    async buildScene(bestResult, blockSize, padding) {
        const {sceneWidth, sceneHeight, size, sceneX, sceneY} = canvas.scene.dimensions;
        const toRotate = [];
        const paddingOffset = padding ? blockSize * size : 0;
        const isEven = blockSize % 2 === 0;
        const evenOffset = isEven ? size / 2 : 0;
        for (const block of bestResult) {
            if (!block.value?.asset) continue;
            const {x, y, z} = block;
            const tokenData = (await game.actors.getName(block.value.asset).getTokenData()).toObject();
            const position = {
                x: (x * blockSize * size) + (blockSize * size / 2) -size/2 + sceneX -paddingOffset + evenOffset,
                y: (y * blockSize * size) + (blockSize * size / 2) -size/2 + sceneY-paddingOffset - evenOffset,
            }
            tokenData.x = position.x;
            tokenData.y = position.y;
            //tokenData.rotation = block.value.rotation;
            toRotate.push({td: tokenData, rotation: block.value.rotation});
        }
        const toCreate = toRotate.map(({td}) => td);
        const tokens = [];
        for (const tokenData of toCreate) {
            const t = await canvas.scene.createEmbeddedDocuments("Token", [tokenData])
            ui.notifications.clear?.();
            tokens.push(t[0]);
        }

        const rotationToOffset = {
            0: {x: 0, y: 0},
            90: {x: 0, y: size},
            180: {x: -size, y: size},
            270: {x: -size, y: 0}
        }

        setTimeout(async () => {
            ui.notifications.clear?.();
            const updates = tokens.map((token, i) => {
                const offset = isEven ? rotationToOffset[toRotate[i].rotation] : {x: 0, y: 0};
                return {_id: token.id, rotation: toRotate[i].rotation, x: token.x + offset.x, y: token.y + offset.y};
            });
            for(const update of updates){
                await canvas.scene.updateEmbeddedDocuments("Token", [update]);
            }
        }, 2000);
    }

    static rotateSockets(original, rotation) {
        const directions = ["up", "right", "down", "left"];
        const sockets = {};
        for (const [key, value] of Object.entries(original)) {
            if(key === "top" || key === "bottom") continue;
            const index = directions.indexOf(key);
            const destinationDirection = directions[(index + rotation / 90) % directions.length];
            sockets[destinationDirection] = value.map((v) => rotation == 180 ? v : WFCProceduralGenerator.swapDirection(v));
        }
        sockets.top = original.top;
        sockets.bottom = original.bottom;
        return sockets;
    }

    static swapDirection(direction) {
        if (direction === "h") return "v";
        if (direction === "v") return "h";
        return direction;
    }

}