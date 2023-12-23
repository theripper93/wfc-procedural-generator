import { initConfig } from "./config.js";
import { registerSettings } from "./settings.js";
import { WFCProceduralGenerator } from "./WFCProceduralGenerator.js";

export const MODULE_ID = "wfc-procedural-generator-2";

export const WFCLib = new WFCProceduralGenerator();

window.WFCLib = WFCLib;

Hooks.on("init", () => {
    initConfig();
    registerSettings();
});

Hooks.on("ready", () => {
    let x = Hooks.callAll(`${MODULE_ID}-init`, WFCLib);
    console.log("WFC Procedural Generator | Ready", `${MODULE_ID}-init`, x);

});