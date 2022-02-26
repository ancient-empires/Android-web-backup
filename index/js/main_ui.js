import { MAIN_UI_ID } from "./key_element_ids.js";

const mainUiProxy = new Proxy({
    "showMainUi": false
}, {
    set: (target, prop, value) => {
        return (() => {
            switch (prop) {
                default:
                    return false;
                case "showMainUi":
                    {
                        const mainUi = document.getElementById(MAIN_UI_ID);
                        mainUi.hidden = !value;
                    }
                    return true;
            }
        })() && (() => {
            target[prop] = value;
            return true;
        })();
    }
});

export const setMainUiVisibility = (value) => {
    mainUiProxy.showMainUi = value;
}