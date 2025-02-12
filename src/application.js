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

  constructor(host, port, ws_server_host, ws_server_port)
  {
    this.#host = host;
    this.#port = port;
    this.#express_app = express();

    this.#express_app.set("view engine", "ejs");
    this.#express_app.set("views", __dirname + "/views");
    this.#express_app.use("/bootstrap", express.static(__dirname + "/bootstrap-dist"));
    this.#express_app.use("/fonts", express.static(__dirname + "/node_modules/source-code-pro"))
    this.#ws_server = new WsServer.WsServer(ws_server_host, ws_server_port);

    this.#routes();
  }

  run()
  {
    this.#express_app.listen(this.#port, this.#host, () => {
      LOGGER.info(`Server is running: ${this.#host}:${this.#port}`);
    });
  }

  #routes()
  {
    this.#express_app.get("/", async (req, res) => {
      res.render("index");
    });

    this.#express_app.get("/config_and_filters", async (req, res) => {
      try
      {
        this.#ws_server.sendCommand("#requestconfig");
        const config = await this.#ws_server.getResponse();

        if (!config)
        {
          return res.status(404).send("No config data available");
        }

        this.#ws_server.sendCommand("#requestfilters");
        const filters = await this.#ws_server.getResponse();

        if (!config)
        {
          return res.status(404).send("No config data available");
        }

        res.render("config_and_filters", { response: { config: config, filters: filters } });
      }
      catch (e)
      {
        res.status(500).send("Error retrieving configuration");
      }
    });
  }
}

module.exports = {
  Application: Application
}
