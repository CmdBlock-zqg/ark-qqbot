class Log {
  constructor(group, conf) {
    this.prefix = "*";
    this.textOnly = false;
    this.fullMsg = true;
    // this.richText = true;
    
    this.group = group;
  }

  async msg(data) {
    console.log(`群${this.group} ${data.sender.card || data.sender.nickname}`);
    console.log(data.message);
  }
};

module.exports = Log;