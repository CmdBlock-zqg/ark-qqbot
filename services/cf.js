const axios = require("axios");
const StorageProvider = require("../storage");
const { sendGroupMsg } = require("../connection");
const conf = require("../config");

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) });
const now = () => Math.floor(new Date().getTime() / 1000);

const groups = conf.services.cf.groups;

let handleGroups = {};
let lstTouched = {};
let handleTesting = {};
let timer = false;

const statusDesc = (s) => {
  const map = {
    "PARTIAL": "对了却没有完全对",
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

const tick = async () => {
  for (const handle of Object.keys(handleGroups)) {
    const t = now();
    let status;
    try {
      const { data } = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=20`);
      status = data.result.reverse();
    } catch {
      continue;
    }
    // console.log(status);

    const send = (msg) => {
      for (const group of handleGroups[handle]) {
        sendGroupMsg(group, msg);
      }
    }

    if (!handleTesting[handle]) handleTesting[handle] = {};

    if (lstTouched[handle] < 0) {
      status = status.filter(x => x.creationTimeSeconds > -lstTouched[handle]);
    } else {
      status = status.filter(x => x.id > lstTouched[handle] || handleTesting[handle][x.id]);
    }
    for (const x of status) {
      if (x.id > lstTouched[handle]) lstTouched[handle] = x.id;
      
      if (!x.verdict || x.verdict === "TESTING") {
        handleTesting[handle][x.id] = true;
        continue;
      }
      if (handleTesting[handle][x.id]) {
        delete handleTesting[handle][x.id];
      }

      const prob = `${x.problem.contestId}${x.problem.index} - ${x.problem.name}`;
      let msg = "";
      if (x.verdict === "OK") {
        msg = `${handle}提交并通过了${prob}！`
      } else {
        msg = `${handle}提交了${prob}，然而${statusDesc(x.verdict)}`
      }
      send(msg);
    }
    await sleep(5000);
  }
};

async function init() {
  // console.log("init");
  handleGroups = {};
  handleTesting = {};
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
  
  timer = setInterval(tick, 60 * 3 * 1000);
}

init().then(tick);

module.exports = {
  reloadService: init
}