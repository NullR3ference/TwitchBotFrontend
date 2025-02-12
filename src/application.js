const express = require("express");
const http = require("http");
const pino = require("pino");
const WsServer = require("./websocket_server");

const LOGGER = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

class Application
{
  #host;
  #port;
  
  #express_app;
  #ws_server;

  constructor(host, port)
  {
    this.#host = host;
    this.#port = port;

    this.#express_app = express();

    this.#express_app.set("views", __dirname + "/views");
    this.#express_app.set("view engine", "ejs");
    this.#express_app.use("/bootstrap", express.static(__dirname + "/bootstrap-dist"));

    this.#ws_server = new WsServer.WsServer();
    this.#routes();
  }

  getHost()
  {
    return this.#host;
  }
  
  getPort()
  {
    return this.#port;
  }

  run()
  {
    this.#express_app.listen(this.#port, this.#host, () => {
      LOGGER.info(`Server is running: ${this.#host}:${this.#port}`);
    });
  }

  #routes()
  {
    this.#express_app.get("/", (req, res) => res.render("index"));
    this.#express_app.get("/config_and_filters", (req, res) => res.render("config_and_filters"));
  }
}

module.exports = {
  Application: Application
}
