import {MODULE_ID} from "./main.js";
import { WFCApp } from "./app.js";

export function registerSettings() {
    game.settings.registerMenu(MODULE_ID, "app", {
        name: `${MODULE_ID}.settings.app.name`,
        label: `${MODULE_ID}.settings.app.label`,
        icon: "fas fa-bars",
        type: WFCApp,
        restricted: true
    });
}