import { MAIN_ID } from "./key_element_ids.js";

const mainUiProxy = new Proxy({
    "showMainElement": false
}, {
    set: (target, prop, value) => {
        return Reflect.has(target, prop)
            && Reflect.set(target, prop, value)
            && (() => {
                switch (prop) {
                    default:
                        break;
                    case "showMainElement":
                        {
                            const mainElement = document.getElementById(MAIN_ID);
                            mainElement.hidden = !value;
                        }
                        break;
                }
                return true;
            })();
    }
});

export const setMainUiVisibility = (value) => {
    mainUiProxy.showMainElement = value;
}