import { MAIN_ID } from "./key_element_ids.js";

const mainUiProxy = new Proxy({
    "showMainElement": false
}, {
    set: (target, prop, value) => {
        return Reflect.has(target, prop)
            && Reflect.set(target, prop, Boolean(value))
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

const setMainUiVisibility = (value) => {
    mainUiProxy.showMainElement = Boolean(value);
}

export default setMainUiVisibility;