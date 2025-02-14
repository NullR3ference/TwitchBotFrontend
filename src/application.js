const express = require("express");
const pino = require("pino");

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

  constructor(host, port)
  {
    this.#host = host;
    this.#port = port;
    this.#express_app = express();

    this.#express_app.set("view engine", "ejs");
    this.#express_app.set("views", __dirname + "/views");

    this.#express_app.use(express.json());
    this.#express_app.use("/bootstrap", express.static(__dirname + "/bootstrap-dist"));
    this.#express_app.use("/fonts", express.static(__dirname + "/node_modules/source-code-pro"));
    this.#express_app.use("/styles", express.static(__dirname + "/css"));

    this.#routes();
  }

  run()
  {
    this.#express_app.listen(this.#port, this.#host, (err) => {
      if (err)
      {
        LOGGER.error("Error: " + err.message);
        return;
      }
      LOGGER.info(`Server is running: ${this.#host}:${this.#port}`);
    });
  }

  #routes()
  {
    this.#express_app.get("/", (req, res) => {
      res.render("index");
    });

    this.#express_app.get("/config", (req, res) => {
      res.render("config");
    });

    this.#express_app.get("/filters", (req, res) => {
      res.render("filters");
    });
  }
}

module.exports = {
  Application: Application
}
