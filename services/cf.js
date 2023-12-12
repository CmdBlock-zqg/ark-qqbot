const axios = require("axios");
const StorageProvider = require("../storage");
const { sendGroupMsg } = require("../connection");
const conf = require("../config");

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) });
const now = () => Math.floor(new Date().getTime() / 1000);

const groups = conf.services.cf.groups;

let handleGroups = {};
let lstTouched = {};
let timer = false;

const statusDesc = (s) => {
  const map = {
    "COMPILATION_ERROR": "编译没过，他在干什么",
    "WRONG_ANSWER": "WA的一声哭了出来",
    "PRESENTATION_ERROR": "输出格式错误哈哈哈哈哈",
    "TIME_LIMIT_EXCEEDED": "T了",
    "MEMORY_LIMIT_EXCEEDED": "爆内存了",
    "IDLENESS_LIMIT_EXCEEDED": "没写输出？",
    "CRASHED": "RE了"
  };
  return map[s] ? map[s] : "没过";
};

async function init() {
  // console.log("init");
  handleGroups = {};
  const t = now();
  for (const group of groups) {
    const db = new StorageProvider("cf_" + group);
    const ls = await db.SMembers("sub");
    for (const handle of ls) {
      lstTouched[handle] = t;
      if (handleGroups[handle]) handleGroups[handle].push(group);
      else handleGroups[handle] = [group];
    }
  }
  if (timer) clearInterval(timer);
  timer = setInterval(async () => {
    // console.log("timer tick");
    const t = now();
    const handles = Object.keys(handleGroups).join(";");
    let userList;
    try {
      const { data } = await axios.get(`https://codeforces.com/api/user.info?handles=${handles}`);
      userList = data.result;
      // console.log(userList);
    } catch {
      return;
    }
    for (const user of userList) {
      if (t - user.lastOnlineTimeSeconds > 30 * 60) continue;
      
      let status;
      try {
        const { data } = await axios.get(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=20`);
        status = data.result;
      } catch {
        continue;
      }
      // console.log(status);

      const send = (msg) => {
        for (const group of handleGroups[user]) {
          sendGroupMsg(group, msg);
        }
      }

      status.filter(x => x.creationTimeSeconds > t && x.verdict && x.verdict !== "PARTIAL" && x.verdict !== "TESTING");
      for (const x of status) {
        const prob = `${x.problem.contestId}${x.problem.index} - ${x.problem.name}`;
        let msg = "";
        if (x.verdict === "OK") {
          msg = `${user}提交并通过了${prob}！`
        } else {
          msg = `${user}提交了${prob}，然而${statusDesc(x.verdict)}`
        }
        send(msg);
      }
      await sleep(5000);
    }
  }, 60 * 3 * 1000);
}

init();

module.exports = {
  reloadService: init
}