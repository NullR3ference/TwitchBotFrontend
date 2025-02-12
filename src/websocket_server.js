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
  #ws_server_handle;

  constructor()
  {
    this.#ws_server_handle = new ws.WebSocketServer({ host: "127.0.0.1", port: 8812 });
    this.#ws_server_handle.on("connection", this.#onClientConnected);
  }

  #onClientConnected(ws)
  {
    ws.on("error", (err) => {
      LOGGER.error("WebSocketServer error: " + err.message);
    });

    ws.on("message", (message) => {
      LOGGER.info(`Message received: ${message}`);
    });

    ws.on("disconnected", () => {
    });

    ws.send(COMMANDS[0]);
  }
}

module.exports = {
  WsServer: WsServer
}
