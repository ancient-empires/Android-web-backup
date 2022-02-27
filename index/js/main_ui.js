import { MAIN_UI_ID } from "./key_element_ids.js";

const mainUiProxy = new Proxy({
    "showMainUi": false
}, {
    set: (target, prop, value) => {
        return Reflect.has(target, prop)
            && Reflect.set(target, prop, value)
            && (() => {
                switch (prop) {
                    default:
                        break;
                    case "showMainUi":
                        {
                            const mainUi = document.getElementById(MAIN_UI_ID);
                            mainUi.hidden = !value;
                        }
                        break;
                }
                return true;
            })();
    }
});

export const setMainUiVisibility = (value) => {
    mainUiProxy.showMainUi = value;
}