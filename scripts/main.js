import {initConfig} from "./config.js";
import { registerSettings } from "./settings.js";

export const MODULE_ID = "wfc-procedural-generator";

Hooks.on("init", () => {
    initConfig();
    registerSettings();
});