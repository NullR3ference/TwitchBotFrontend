const Application = require("./src/application")

// https://stackoverflow.com/questions/53294938/simple-example-on-how-to-use-websockets-between-client-and-server

const HTTP_SERVER_HOST = "127.0.0.1";
const HTTP_SERVER_PORT = 8811;

const WEBSOCKET_SERVER_HOST = "127.0.0.1";
const WEBSOCKET_SERVER_PORT = 8812;

const app = new Application.Application(
    HTTP_SERVER_HOST,
    HTTP_SERVER_PORT,
    WEBSOCKET_SERVER_HOST,
    WEBSOCKET_SERVER_PORT
);

app.run();
