import { MODULE_ID } from "./main.js";

const REGISTER_TEST_PACKS = true;

export function initConfig() {

    if (!REGISTER_TEST_PACKS) return;

    Hooks.on(`wfc-procedural-generator-2-init`, (wfc) => {
        console.log("[config.js] Registering test packs");

        wfc.registerPack("degruchy-test", {
            name: "DeGruchy test pack",
            computeRotated: true,
            generators: [
                {
                    name: "Test Pack",
                    description: "A simple test pack.",
                    padding: "empty",
                    dataset: [
                        //Curve
                        {
                            "id": "template-Curve-vh-1",
                            "asset": "template-Curve-vh-1",
                            "centreOffset": { "x": -100, "y": -100, "z": 0 },
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
                            "id": "template-Straight-v-1",
                            "asset": "template-Straight-v-1",
                            "rotation": 0,
                            "weight": 10,
                            "sockets": {
                                "left": ["empty"],
                                "right": ["empty"],
                                "up": ["v"],
                                "down": ["v"],
                                "top": [],
                                "bottom": []
                            }
                        },
                        //Bifurcation
                        // {
                        //     "id": "template-Bifurcation-v-1",
                        //     "asset": "template-Bifurcation-v-1",
                        //     "rotation": 0,
                        //     "weight": 1,
                        //     "sockets": {
                        //         "left": ["h"],
                        //         "right": ["h"],
                        //         "up": ["v"],
                        //         "down": ["v"],
                        //         "top": [],
                        //         "bottom": []
                        //     }
                        // },

                        //End
                        // {
                        //     "id": "template-End-v-1",
                        //     "asset": "template-End-v-1",
                        //     "rotation": 0,
                        //     "weight": 0.001,
                        //     "sockets": {
                        //         "left": ["empty"],
                        //         "right": ["empty"],
                        //         "up": ["empty"],
                        //         "down": ["v"],
                        //         "top": [],
                        //         "bottom": []
                        //     }
                        // },
                        // {
                        //     "id": "template-Offset-vh-1",
                        //     "asset": "template-Offset-vh-1",
                        //     "centreOffset": { "x": -1, "y": -1, "z": 0 },
                        //     "rotation": 0,
                        //     "weight": 200,
                        //     "sockets": {
                        //         "left": ["h"],
                        //         "right": ["h"],
                        //         "up": ["v"],
                        //         "down": ["v"],
                        //         "top": [],
                        //         "bottom": []
                        //     }
                        // },
                    ],
                    iterations: 10,
                    blockSize: 3,
                }
            ],
        });

    }
    )
}