const { sendGroupMsg } = require("../connection");

class Play {
  constructor(group, conf) {
    this.prefix = "#";
    this.textOnly = true;

    this.group = group;
  }

  async msg(msg, user) {
    sendGroupMsg(this.group, msg.slice(1));
  }
};

module.exports = Play;