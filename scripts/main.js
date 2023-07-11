import {initConfig} from "./config.js";
import {registerSettings} from "./settings.js";
import {WFCApp} from "./app.js";
import { WaveFunctionSolver } from "./WaveFunctionCollapse.js";

export const MODULE_ID = "wfc-procedural-generator";

Hooks.on("init", () => {
    initConfig();
    registerSettings();

    Hooks.callAll(`${MODULE_ID}Init`, WFCLib);

});

class WFCProceduralGenerator{

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
                        newItem.sockets = rotateSockets(newItem.sockets, angle);
                        newDataset.push(newItem);
                    }
                }
                gen.dataset = newDataset;
            }
        }
        this.packs[packId] = packData;
    }

    openApp() {
        new WFCApp(this.packs).render(true);
    }

    learn() {
        
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
        const paddingOffset = padding ? blockSize*size : 0;
        for (const block of bestResult) {
            if (!block.value?.asset) continue;
            const {x, y, z} = block;
            const tokenData = (await game.actors.getName(block.value.asset).getTokenData()).toObject();
            const position = {
                x: (x * blockSize * size) + (blockSize * size / 2) -size/2 + sceneX -paddingOffset,
                y: (y * blockSize * size) + (blockSize * size / 2) -size/2 + sceneY-paddingOffset,
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
        setTimeout(async () => {
            ui.notifications.clear?.();
            const updates = tokens.map((token, i) => {
                return {_id: token.id, rotation: toRotate[i].rotation};
            });
            for(const update of updates){
                await canvas.scene.updateEmbeddedDocuments("Token", [update]);
            }
        }, 2000);
        /*Dialog.confirm({
            title: "WFC Procedural Generator",
            content: `<p>Generation complete. Would you like to rotate the tokens?</p>`,
            yes: async () => {
                //await canvas.scene.updateEmbeddedDocuments("Token", tokens.map((t) => {return {_id:t.id, "flags.token-attacher.needsPostProcessing": false} }));
                const updates = tokens.map((token, i) => {
                    return {_id: token.id, rotation: toRotate[i].rotation};
                });
                canvas.scene.updateEmbeddedDocuments("Token", updates);
            },
            no: () => {},

        })*/
    }

}

function rotateSockets(original, rotation) {
    const directions = ["up", "right", "down", "left"];
    const sockets = {};
    for (const [key, value] of Object.entries(original)) {
        if(key === "top" || key === "bottom") continue;
        const index = directions.indexOf(key);
        const destinationDirection = directions[(index + rotation / 90) % directions.length];
        sockets[destinationDirection] = value.map((v) => rotation == 180 ? v : swapDirection(v));
    }
    sockets.top = original.top;
    sockets.bottom = original.bottom;
    return sockets;
}

function swapDirection(direction) {
    if (direction === "h") return "v";
    if (direction === "v") return "h";
    return direction;
}

export const WFCLib = new WFCProceduralGenerator();

window.WFCLib = WFCLib;

Hooks.on(`wfc-procedural-generatorInit`, (wfc) => {
    wfc.registerPack("tda-modular-dungeon", {
        name: "TDA Modular Dungeon",
        computeRotated: true,
        generators: [
            {
                name: "Dungeon",
                padding: "empty",
                dataset: [
                    //Curve
                    {
                        "id": "Modular Dungeon | Curve",
                        "asset": "Modular Dungeon | Curve",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["empty"],
                            "up": ["empty"],
                            "down": ["v"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | Curve2",
                        "asset": "Modular Dungeon | Curve2",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["empty"],
                            "up": ["empty"],
                            "down": ["v"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | Curve3",
                        "asset": "Modular Dungeon | Curve3",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["empty"],
                            "up": ["empty"],
                            "down": ["v"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | CurveCarpet",
                        "asset": "Modular Dungeon | CurveCarpet",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["empty"],
                            "right": ["h"],
                            "up": ["v"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | CurveStairs",
                        "asset": "Modular Dungeon | CurveStairs",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["empty"],
                            "up": ["empty"],
                            "down": ["v"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    //Straight
                    {
                        "id": "Modular Dungeon | Straight",
                        "asset": "Modular Dungeon | Straight",
                        "rotation": 0,
                        "weight": 10,
                        "sockets": {
                            "left": ["h"],
                            "right": ["h"],
                            "up": ["empty"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | Cave",
                        "asset": "Modular Dungeon | Cave",
                        "rotation": 0,
                        "weight": 10,
                        "sockets": {
                            "left": ["h"],
                            "right": ["h"],
                            "up": ["empty"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | Corridor",
                        "asset": "Modular Dungeon | Corridor",
                        "rotation": 0,
                        "weight": 10,
                        "sockets": {
                            "left": ["h"],
                            "right": ["h"],
                            "up": ["empty"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | CorridorCarpet",
                        "asset": "Modular Dungeon | CorridorCarpet",
                        "rotation": 0,
                        "weight": 10,
                        "sockets": {
                            "left": ["h"],
                            "right": ["h"],
                            "up": ["empty"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | Crystals",
                        "asset": "Modular Dungeon | Crystals",
                        "rotation": 0,
                        "weight": 10,
                        "sockets": {
                            "left": ["h"],
                            "right": ["h"],
                            "up": ["empty"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    //Bifurcation
                    {
                        "id": "Modular Dungeon | Bifurcation",
                        "asset": "Modular Dungeon | Bifurcation",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["h"],
                            "up": ["empty"],
                            "down": ["v"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | Library",
                        "asset": "Modular Dungeon | Library",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["h"],
                            "up": ["empty"],
                            "down": ["v"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | Cross",
                        "asset": "Modular Dungeon | Cross",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["h"],
                            "up": ["v"],
                            "down": ["v"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | End",
                        "asset": "Modular Dungeon | End",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["empty"],
                            "up": ["empty"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | SkeletonsPit",
                        "asset": "Modular Dungeon | SkeletonsPit",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["empty"],
                            "up": ["empty"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | Stairs",
                        "asset": "Modular Dungeon | Stairs",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["empty"],
                            "up": ["empty"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                    {
                        "id": "Modular Dungeon | Hall",
                        "asset": "Modular Dungeon | Hall",
                        "rotation": 0,
                        "weight": 1,
                        "sockets": {
                            "left": ["h"],
                            "right": ["empty"],
                            "up": ["empty"],
                            "down": ["empty"],
                            "top": [],
                            "bottom": []
                        }
                    },
                ],
                iterations: 1000,
                blockSize: 11,
            }
        ],
    });
});