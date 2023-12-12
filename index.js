const conf = require("./config");
const conn = require("./connection");

const moduleProvider = {
  play: require("./modules/play"),
  log: require("./modules/log"),
  cf: require("./modules/cf")
};

const moduleHandler = {};

for (const group in conf.modules) {
  const groupModuleConf = conf.modules[group];
  const modules = [];
  for (const moduleId in groupModuleConf) {
    const conf = groupModuleConf[moduleId];
    modules.push(new moduleProvider[moduleId](Number(group), conf));
  }
  moduleHandler[group] = modules;
}

function onGroupMsg(data) {
  const msg = data.message;
  let text = "";
  for (const i of msg) {
    if (i.type === "text") text += i.data.text;
  }
  if (!moduleHandler[data.group_id]) return;
  for (const i of moduleHandler[data.group_id]) {
    if (i.prefix === "*" || text.indexOf(i.prefix) === 0) {
      if (i.fullMsg) {
        i.msg(data);
      } else if (i.richText) {
        i.msg(msg, data.user_id);
      } else {
        i.msg(text, data.user_id);
      }
    }
  }
}

conn.addHandler(1, (obj) => {
  if (obj.post_type === "message" && obj.message_type === "group") {
    onGroupMsg(obj);
  }
});
