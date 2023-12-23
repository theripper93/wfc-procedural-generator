import { MODULE_ID } from "./main.js";

const REGISTER_TEST_PACKS = true;

export function initConfig() {

    if (!REGISTER_TEST_PACKS) return;

    Hooks.on(`wfc-procedural-generator-2-init`, (wfc) => {
        console.log("[config.js] Registering test packs");
        // wfc.registerPack("tda-modular-dungeon", {
        //     name: "TDA Modular Dungeon",
        //     computeRotated: true,
        //     socketRotationMapping: [
        //         ["river_h", "river_v"]
        //     ],
        //     generators: [
        //         {
        //             name: "Dungeon Complete",
        //             padding: "empty",
        //             description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        //             dataset: [
        //                 //Curve
        //                 {
        //                     "id": "Modular Dungeon | Curve",
        //                     "asset": "Modular Dungeon | Curve",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Curve2",
        //                     "asset": "Modular Dungeon | Curve2",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Curve3",
        //                     "asset": "Modular Dungeon | Curve3",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | CurveCarpet",
        //                     "asset": "Modular Dungeon | CurveCarpet",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["empty"],
        //                         "right": ["h"],
        //                         "up": ["v"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | CurveStairs",
        //                     "asset": "Modular Dungeon | CurveStairs",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 //Straight
        //                 {
        //                     "id": "Modular Dungeon | Straight",
        //                     "asset": "Modular Dungeon | Straight",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Cave",
        //                     "asset": "Modular Dungeon | Cave",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Corridor",
        //                     "asset": "Modular Dungeon | Corridor",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | CorridorCarpet",
        //                     "asset": "Modular Dungeon | CorridorCarpet",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Crystals",
        //                     "asset": "Modular Dungeon | Crystals",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 //Bifurcation
        //                 {
        //                     "id": "Modular Dungeon | Bifurcation",
        //                     "asset": "Modular Dungeon | Bifurcation",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Library",
        //                     "asset": "Modular Dungeon | Library",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Cross",
        //                     "asset": "Modular Dungeon | Cross",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["v"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 //End
        //                 {
        //                     "id": "Modular Dungeon | End",
        //                     "asset": "Modular Dungeon | End",
        //                     "rotation": 0,
        //                     "weight": 0.0001,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | SkeletonsPit",
        //                     "asset": "Modular Dungeon | SkeletonsPit",
        //                     "rotation": 0,
        //                     "weight": 0.0001,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Stairs",
        //                     "asset": "Modular Dungeon | Stairs",
        //                     "rotation": 0,
        //                     "weight": 0.0001,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Hall",
        //                     "asset": "Modular Dungeon | Hall",
        //                     "rotation": 0,
        //                     "weight": 0.0001,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //             ],
        //             iterations: 1000,
        //             blockSize: 11,
        //         },
        //         {
        //             name: "Dungeon No-Carpets",
        //             description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        //             padding: "empty",
        //             dataset: [
        //                 //Curve
        //                 {
        //                     "id": "Modular Dungeon | Curve",
        //                     "asset": "Modular Dungeon | Curve",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Curve2",
        //                     "asset": "Modular Dungeon | Curve2",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Curve3",
        //                     "asset": "Modular Dungeon | Curve3",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | CurveStairs",
        //                     "asset": "Modular Dungeon | CurveStairs",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 //Straight
        //                 {
        //                     "id": "Modular Dungeon | Straight",
        //                     "asset": "Modular Dungeon | Straight",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Cave",
        //                     "asset": "Modular Dungeon | Cave",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Corridor",
        //                     "asset": "Modular Dungeon | Corridor",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Crystals",
        //                     "asset": "Modular Dungeon | Crystals",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 //Bifurcation
        //                 {
        //                     "id": "Modular Dungeon | Bifurcation",
        //                     "asset": "Modular Dungeon | Bifurcation",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Library",
        //                     "asset": "Modular Dungeon | Library",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Cross",
        //                     "asset": "Modular Dungeon | Cross",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["v"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 //End
        //                 {
        //                     "id": "Modular Dungeon | End",
        //                     "asset": "Modular Dungeon | End",
        //                     "rotation": 0,
        //                     "weight": 0.0001,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | SkeletonsPit",
        //                     "asset": "Modular Dungeon | SkeletonsPit",
        //                     "rotation": 0,
        //                     "weight": 0.0001,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Stairs",
        //                     "asset": "Modular Dungeon | Stairs",
        //                     "rotation": 0,
        //                     "weight": 0.0001,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 {
        //                     "id": "Modular Dungeon | Hall",
        //                     "asset": "Modular Dungeon | Hall",
        //                     "rotation": 0,
        //                     "weight": 0.0001,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //             ],
        //             iterations: 1000,
        //             blockSize: 11,
        //         }
        //     ],
        // });
        // wfc.registerPack("tda-modular-streets", {
        //     name: "TDA Modular Streets",
        //     computeRotated: true,
        //     generators: [
        //         {
        //             name: "Streets",
        //             description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        //             padding: "empty",
        //             dataset: [
        //                 //Curve
        //                 {
        //                     "id": "Modular Street | Day | Alley Curve",
        //                     "asset": "Modular Street | Day | Alley Curve",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },

        //                 //Straight
        //                 {
        //                     "id": "Modular Street | Day | Alley Straight",
        //                     "asset": "Modular Street | Day | Alley Straight",
        //                     "rotation": 0,
        //                     "weight": 10,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //                 //Bifurcation
        //                 {
        //                     "id": "Modular Street | Day | Alley Bifurcation",
        //                     "asset": "Modular Street | Day | Alley Bifurcation",
        //                     "rotation": 0,
        //                     "weight": 1,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["h"],
        //                         "up": ["empty"],
        //                         "down": ["v"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },

        //                 //End
        //                 {
        //                     "id": "Modular Street | Day | End",
        //                     "asset": "Modular Street | Day | End",
        //                     "rotation": 0,
        //                     "weight": 0.0001,
        //                     "sockets": {
        //                         "left": ["h"],
        //                         "right": ["empty"],
        //                         "up": ["empty"],
        //                         "down": ["empty"],
        //                         "top": [],
        //                         "bottom": []
        //                     }
        //                 },
        //             ],
        //             iterations: 1000,
        //             blockSize: 8,
        //         }
        //     ],
        // });
        wfc.registerPack("degruchy-test", {
            name: "DeGruchy test pack",
            computeRotated: false,
            generators: [
                {
                    name: "Test Pack",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    padding: "empty",
                    dataset: [

                        //End
                        {
                            "id": "downwarn-1-door",
                            "asset": "downwarn-1-door",
                            "rotation": 0,
                            "weight": 0.0001,
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
                    blockSize: 3,
                }
            ],
        });

    }
    )
}