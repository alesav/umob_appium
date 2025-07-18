import Page from "./page.js";

class MainMapScreen extends Page {
    /**
     * define elements
     */
    get btnStart() {
        return $("button=Start");
    }
    get loadedPage() {
        return $("#finish");
    }
    get accountButton() {
        return $('-android uiautomator:new UiSelector().text("Account")');
    }

    /**
     * define or overwrite page methods
     */
    async open(): Promise<string> {
        return super.open("dynamic_loading/2");
    }
}

export default new MainMapScreen();
