const axios = require("axios");
const time = require("../utils/time");
const StorageProvider = require("../storage");
const { sendGroupMsg } = require("../connection");
const { reloadService } = require("../services/cf");

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) });

async function getContestList() {
  let { data } = await axios.get("https://codeforces.com/api/contest.list");
  if (!data.result) return "请求过于频繁";
  const t = Math.floor(new Date().getTime() / 1000);
  data = data.result
    .filter((x) => x.startTimeSeconds > t)
    .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
  const durStr = (s) => {
    const d = Math.floor(s / 86400),
          h = Math.floor(s % 86400 / 3600),
          m = Math.floor(s % 3600 / 60);
    const f = (n) => n > 9 ? `${n}` : `0${n}`;
    if (d) {
      return `${f(d)}:${f(h)}:${f(m)}`;
    } else {
      return `${f(h)}:${f(m)}`;
    }
  };
  let res = "";
  for (let i = 0; i < 5; ++i) {
    const c = data[i];
    if (!c) continue;
    if (i) res += "\n\n";
    res += `${c.name}
时间：${new Date(c.startTimeSeconds * 1000).toLocaleString()}
时长：${durStr(c.durationSeconds)}`
  }
  return res;
}

async function getUser(handle) {
  let data;
  try {
    data = (await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`)).data;
  } catch {
    return false;
  }
  if (!data.result) return false;
  const user = data.result[0];
  return `${handle}
上次在线时间：${time.desc(user.lastOnlineTimeSeconds)}
Rating: ${user.rating}
最高Rating：${user.maxRating}`;
}

async function subUser(handle, db) {
  const t = await getUser(handle);
  if (!t) return false;
  await db.SAdd("sub", handle);
  reloadService();
  return true;
}

async function unsubUser(handle, db) {
  await db.SRem("sub", handle);
  reloadService();
  return true;
}

async function getSubList(db) {
  res = await db.SMembers("sub");
  if (res.length) {
    return "已关注用户：" + res.join(", ");
  } else {
    return "暂时未关注任何用户"
  }
}

class Cf {
  constructor(group, conf) {
    this.prefix = "cf";
    this.textOnly = true;

    this.group = group;
    this.db = new StorageProvider("cf_" + group);
  }

  async msg(msg, user) {
    const o = msg.split(" ");
    let res = "";
    if (o[1] === "help") {
      res = `cf使用帮助
cf ls 查询比赛列表
cf user [handle] 查询用户
cf sub [handle] 关注用户
cf subls 关注用户列表
cd unsub [handle] 取消关注用户`;
    } else if (o[1] === "ls") {
      res = await getContestList();
    } else if (o[1] === "user") {
      res = await getUser(o[2]) || "用户不存在";
    } else if (o[1] === "sub") {
      if (await subUser(o[2], this.db)) {
        res = `关注用户${o[2]}成功`;
      } else {
        res = "用户不存在";
      }
    } else if (o[1] === "unsub") {
      if (await unsubUser(o[2], this.db)) {
        res = `已取消关注用户${o[2]}`;
      }
    } else if (o[1] === "subls") {
      res = await getSubList(this.db);
    }
    if (res) sendGroupMsg(this.group, res);
  }
};

module.exports = Cf;