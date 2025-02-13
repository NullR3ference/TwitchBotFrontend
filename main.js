const Application = require("./src/application")

// https://stackoverflow.com/questions/53294938/simple-example-on-how-to-use-websockets-between-client-and-server

const HOST = "127.0.0.1";
const PORT = 8080;

const app = new Application.Application(HOST, PORT);
app.run();
