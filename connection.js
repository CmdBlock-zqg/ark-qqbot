const WebSocket = require("ws");
const conf = require("./config");

const ws = new WebSocket(conf.ws);

ws.on("open", () => {
  console.log("WebSocket connected.");
});

ws.on("close", () => {
  process.exit(1);
});

const handlers = {}
function addHandler(id, func) {
  handlers[id] = func;
}
function delHandler(id) {
  delete handlers[id];
}
ws.on("message", (data) => {
  const obj = JSON.parse(data.toString("utf8"));
  for (id in handlers) {
    handlers[id](obj);
  }
})

function send(action, params) {
  ws.send(JSON.stringify({
    action: action,
    params: params
  }));
}

async function sendGroupMsg(group, msg) {
  send("send_group_msg", {
    group_id: group,
    message: msg
  });
}

module.exports = {
  addHandler,
  delHandler,
  sendGroupMsg
}