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
  #server;

  constructor(host, port)
  {
    this.#host = host;
    this.#port = port;
    this.#server = express();

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
    LOGGER.info(`Server is running: ${this.#host}:${this.#port}`)
    this.#server.listen(this.#port, this.#host);
  }

  #routes()
  {
    this.#server.get("/", (req, res) => {
      res.send("<!DOCTYPE html><html><h1>TEST</></html>");
    });
  }
}

module.exports = {
  Application: Application
}
