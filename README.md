# Ancient Empires source code backup (Android & web versions)
This repository provides the backup of source code for the Ancient Empires Android & web versions, as well as the APK files of the Android version.

* [Original repository](https://github.com/webbestmaster/main) (by [webbestmaster](https://github.com/webbestmaster))
* [Fork repository](https://github.com/ancient-empires-resources/webbestmaster-backup)

## Download Android version

Go to the **`apk`** directory to download the Android version.

## Running the web version on PC

This game is designed to run in [Android WebView](https://developer.chrome.com/docs/multidevice/webview/), a Chrome-based built-in component on Android phones for displaying web content. Hence it can also be run in a PC web browser.

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

    The two scripts below use the [`http-server`](https://npmjs.com/package/http-server) package.
    * For Ancient Empires 1, run:
        ```shell
        npm run AE1
        ```
    * For Ancient Empires 2, run:
        ```shell
        npm run AE2
        ```

    After starting the server, there will be a list of servers available as shown in the console.
    * http://127.0.0.1:8080 refers to localhost. *You are advised to use this address to start the game.*
    * If you have connected to WiFi or Ethernet to access the Internet, the IP address of your PC will also be displayed in the list. *However these addresses are not recommended for use as they are unstable.*
    * In order to save your progress, you must launch the game using the **same server address and port number** every time.
    * If http://127.0.0.1:8080 is occupied, the server will be started on port 8081, 8082, …, etc. But you will not retrieve your existing progress. *So it is recommended that you ensure that the port 8080 on your PC is ready for use.*
4. **Start browser to play the game.**

    Open Google Chrome.

    Then click on "**User-Agent Switcher and Manager**", select one of the Android user agents.

    After that, copy and paste the server address you saw in the console into the browser address bar to launch the game.
5. **After finishing, stop the server.**

    After you finish playing the game and close the browser, go back to the console and press `Ctrl`+`C` to stop the server.
