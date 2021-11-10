# Ancient Empires source code backup (Android version)

Backup source code for the Android version.

* Original repository: https://github.com/webbestmaster/main
* Fork: https://github.com/ancient-empires-resources/webbestmaster-backup

Note that this repository only copies the latest code from the original repository. Please click on the two links above to check the history of the commits.

## Running the games in web browser

### Prerequisites
To run the AE1 and AE2 games in web browser, you must have all these prerequisites ready:
1. A web browser that supports [Web SQL](https://www.w3.org/TR/webdatabase/), such as [Google Chrome](https://chrome.google.com).
2. The "[User-Agent Switcher and Manager](https://chrome.google.com/webstore/detail/user-agent-switcher-and-m/bhchdcejhohfmigjafbampogmaanbfkg)" browser extension for Chrome.
3. [Node.js](https://nodejs.org/en/download/) version >= 12.0.0.
4. [`http-server`](https://www.npmjs.com/package/http-server) NPM package.

### How to setup & start the game
1. **Install Node.js.**

    You may visit https://nodejs.org/en/download/ to download and install the Node.js that is suitable for your operating system.
    * For example, in Ubuntu, the most convenient version is the snap version, which can be installed using
        ```shell
        sudo snap install node --classic
        ```
2. **Install NPM packages.**

    You may run
    ```shell
    npm install
    ```
    in this directory to install all the NPM packages needed.
3. **Run HTTP server.**

    * For Ancient Empires 1, run:
        ```shell
        npx http-server AE1/www -c-1
        ```
    * For Ancient Empires 2, run:
        ```shell
        npx http-server AE2/www -c-1
        ```

    Here `-c-1` disables caching.

    After starting the server, there will be a list of servers available in the console, such as http://127.0.0.1:8080 (same on every computer) or http://100.65.0.235:8080 (may be different across different computers).
    * In order to save your progress, you must launch the game using the *same server address* every time.
4. **Start browser.**

    Open Google Chrome.

    Then click on "**User-Agent Switcher and Manager**", select one of the Android user agents.

    After that, copy and paste the server address you saw in the console into the browser address bar to launch the game.
5. **After finishing, stop the server.**

    After you finish playing the game and close the browser, go back to the console and press `Ctrl`+`C` to stop the server.