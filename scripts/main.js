import { initConfig } from "./config.js";
import { registerSettings } from "./settings.js";
import { WFCProceduralGenerator } from "./WFCProceduralGenerator.js";

export const MODULE_ID = "wfc-procedural-generator";

export const WFCLib = new WFCProceduralGenerator();

window.WFCLib = WFCLib;

Hooks.on("init", () => {
    initConfig();
    registerSettings();
});

Hooks.on("ready", () => {
    Hooks.callAll(`${MODULE_ID}Init`, WFCLib);
});