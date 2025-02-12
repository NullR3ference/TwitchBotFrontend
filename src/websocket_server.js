const ws = require("ws");
const pino = require("pino");

const LOGGER = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

const COMMANDS = [
  "#requestconfig",
  "#requestfilters"
];

class WsServer
{
  #ws_server;
  #current_client = null;

  constructor(host, port)
  {
    this.response_promise = null;
    this.resolve_response = null;

    this.onClientConnected = this.onClientConnected.bind(this);
    this.handleMessage = this.handleMessage.bind(this);

    this.#ws_server = new ws.WebSocketServer({ host: host, port: port });
    this.#ws_server.on("connection", this.onClientConnected);
  }

  sendCommand(cmd)
  {
    if (!cmd.startsWith("#"))
    {
      LOGGER.error("Invalid command: " + cmd);
      return;
    }

    if (this.#current_client)
    {
      this.#current_client.send(cmd);
      LOGGER.info("Sending command: " + cmd);

      this.response_promise = new Promise((resolve, reject) => {
        this.resolve_response = resolve;
        setTimeout(() => { reject("Timeout") }, 5000);
      });
    }
  }

  getResponse()
  {
    return this.response_promise;
  }

  onClientConnected(client)
  {
    this.#current_client = client;

    client.on("error", (err) => {
      LOGGER.error("WebSocketServer error: " + err.message);
    });

    client.on("message", this.handleMessage.bind(this));

    client.on("disconnect", (() => {
      LOGGER.info("Client disconnected");
      this.#current_client = null;
    }).bind(this));

    LOGGER.info("Client connected");
  }

  handleMessage(message)
  {
    if (this.resolve_response)
    {
      this.resolve_response(message);
      this.resetResponse();
    }
  }

  resetResponse()
  {
    this.response_promise = null;
    this.resolve_response = null;
  }
}

module.exports = {
  WsServer: WsServer
}
