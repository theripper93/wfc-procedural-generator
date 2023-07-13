import {WFCLib} from "./main.js";
import { MODULE_ID } from "./main.js";

export class WFCApp extends Application{
    constructor (packs) {
        super();
        this.packs = {};
        const sortedPacks = Object.values(packs).sort((a, b) => a.name.localeCompare(b.name)).map((pack) => pack.id);
        sortedPacks.forEach((packId) => {
            this.packs[packId] = packs[packId];
        });
        this.currentPack = Object.keys(this.packs)[0];
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = `modules/${MODULE_ID}/templates/WFCApp.hbs`;
        options.width = 500;
        options.height = 600;
        options.title = game.i18n.localize(`${MODULE_ID}.title`);
        options.classes = ["wfc", "package-configuration"];
        options.resizable = true;
        return options;
    }

    async getData() {
        const packs = [];
        for (const [packId, pack] of Object.entries(this.packs)) {
            packs.push({
                id: packId,
                title: pack.name,
                count: pack.generators.length
            });
            pack.generators.forEach((generator, index) => {
                generator.count = generator.dataset.length;
                generator.index = index;
                generator.valid = WFCLib.validate(generator);
            });
        }
        return {packs, currentPack: this.packs[this.currentPack]};
    }

    activateListeners(html) {
        html = html[0];
        html.querySelectorAll(".item").forEach((pack) => {
            pack.addEventListener("click", (event) => {
                this.currentPack = event.currentTarget.dataset.tab;
                this.render(true);
            });
        });
        html.querySelectorAll("button.generate").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const packId = this.currentPack;
                const generatorIndex = event.currentTarget.dataset.index;
                const generator = this.packs[packId].generators[generatorIndex];
                WFCLib.generate(generator);
                this.close();
            });
        });
    }
}