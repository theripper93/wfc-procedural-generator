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
        const widthBlocks = Math.ceil(sceneWidth / pxBlockSize);
        const heightBlocks = Math.ceil(sceneHeight / pxBlockSize);
        const solver = new WaveFunctionSolver(data.dataset, widthBlocks, heightBlocks, 1);
        const bestResult = solver.collapse(false, data.iterations ?? 100);
        this.buildScene(bestResult, blockSize);
    }

    async buildScene(grid3, blockSize) {
        const {sceneWidth, sceneHeight, size, sceneX, sceneY} = canvas.scene.dimensions;
        const toRotate = [];
        for (const block of grid3.data) {
            if(!block.value) continue;
            const {x, y, z} = grid3.getXYZ(block);
            const tokenData = (await game.actors.getName(block.value.asset).getTokenData()).toObject();
            const position = {
                x: (x * blockSize * size) + (blockSize * size / 2) -size/2 + sceneX,
                y: (y * blockSize * size) + (blockSize * size / 2) -size/2 + sceneY,
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
            tokens.push(t[0]);
        }
        Dialog.confirm({
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

        })
    }

}

export const WFCLib = new WFCProceduralGenerator();

window.WFCLib = WFCLib;

Hooks.on(`wfc-procedural-generatorInit`, (wfc) => {
    wfc.registerPack("tda-modular-dungeon", {
        name: "TDA Modular Dungeon",
        generators: [
            {
                name: "Dungeon",
                dataset: [
    {
        "id": "Modular Dungeon | Curve0",
        "asset": "Modular Dungeon | Curve",
        "rotation": 0,
        "weight": 1,
        "sockets": {
            "left": [
                "Modular Dungeon | CorridorCarpet0"
            ],
            "right": [],
            "up": [],
            "down": [
                "Modular Dungeon | CorridorCarpet90"
            ],
            "top": [],
            "bottom": []
        },
        "allow": {
            "left": [
                "Modular Dungeon | CorridorCarpet0"
            ],
            "right": [],
            "up": [],
            "down": [
                "Modular Dungeon | CorridorCarpet90"
            ],
            "top": [],
            "bottom": []
        }
    },
    {
        "id": "Modular Dungeon | CorridorCarpet0",
        "asset": "Modular Dungeon | CorridorCarpet",
        "rotation": 0,
        "weight": 6,
        "sockets": {
            "left": [
                "Modular Dungeon | CorridorCarpet0",
                "Modular Dungeon | Curve270",
                "Modular Dungeon | Curve180"
            ],
            "right": [
                "Modular Dungeon | CorridorCarpet0",
                "Modular Dungeon | Curve0",
                "Modular Dungeon | Curve90"
            ],
            "up": [],
            "down": [],
            "top": [],
            "bottom": []
        },
        "allow": {
            "left": [
                "Modular Dungeon | CorridorCarpet0",
                "Modular Dungeon | Curve270",
                "Modular Dungeon | Curve180"
            ],
            "right": [
                "Modular Dungeon | CorridorCarpet0",
                "Modular Dungeon | Curve0",
                "Modular Dungeon | Curve90"
            ],
            "up": [],
            "down": [],
            "top": [],
            "bottom": []
        }
    },
    {
        "id": "Modular Dungeon | CorridorCarpet90",
        "asset": "Modular Dungeon | CorridorCarpet",
        "rotation": 90,
        "weight": 6,
        "sockets": {
            "left": [],
            "right": [],
            "up": [
                "Modular Dungeon | Curve0",
                "Modular Dungeon | CorridorCarpet90",
                "Modular Dungeon | Curve270"
            ],
            "down": [
                "Modular Dungeon | CorridorCarpet90",
                "Modular Dungeon | Curve90",
                "Modular Dungeon | Curve180"
            ],
            "top": [],
            "bottom": []
        },
        "allow": {
            "left": [],
            "right": [],
            "up": [
                "Modular Dungeon | Curve0",
                "Modular Dungeon | CorridorCarpet90",
                "Modular Dungeon | Curve270"
            ],
            "down": [
                "Modular Dungeon | CorridorCarpet90",
                "Modular Dungeon | Curve90",
                "Modular Dungeon | Curve180"
            ],
            "top": [],
            "bottom": []
        }
    },
    {
        "id": "Modular Dungeon | Curve90",
        "asset": "Modular Dungeon | Curve",
        "rotation": 90,
        "weight": 1,
        "sockets": {
            "left": [
                "Modular Dungeon | CorridorCarpet0"
            ],
            "right": [],
            "up": [
                "Modular Dungeon | CorridorCarpet90"
            ],
            "down": [],
            "top": [],
            "bottom": []
        },
        "allow": {
            "left": [
                "Modular Dungeon | CorridorCarpet0"
            ],
            "right": [],
            "up": [
                "Modular Dungeon | CorridorCarpet90"
            ],
            "down": [],
            "top": [],
            "bottom": []
        }
    },
    {
        "id": "Modular Dungeon | Curve270",
        "asset": "Modular Dungeon | Curve",
        "rotation": 270,
        "weight": 1,
        "sockets": {
            "left": [],
            "right": [
                "Modular Dungeon | CorridorCarpet0"
            ],
            "up": [],
            "down": [
                "Modular Dungeon | CorridorCarpet90"
            ],
            "top": [],
            "bottom": []
        },
        "allow": {
            "left": [],
            "right": [
                "Modular Dungeon | CorridorCarpet0"
            ],
            "up": [],
            "down": [
                "Modular Dungeon | CorridorCarpet90"
            ],
            "top": [],
            "bottom": []
        }
    },
    {
        "id": "Modular Dungeon | Curve180",
        "asset": "Modular Dungeon | Curve",
        "rotation": 180,
        "weight": 1,
        "sockets": {
            "left": [],
            "right": [
                "Modular Dungeon | CorridorCarpet0"
            ],
            "up": [
                "Modular Dungeon | CorridorCarpet90"
            ],
            "down": [],
            "top": [],
            "bottom": []
        },
        "allow": {
            "left": [],
            "right": [
                "Modular Dungeon | CorridorCarpet0"
            ],
            "up": [
                "Modular Dungeon | CorridorCarpet90"
            ],
            "down": [],
            "top": [],
            "bottom": []
        }
    }
],
                iterations: 10,
                blockSize: 11,
            }
        ],
    });
});