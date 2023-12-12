const redis = require("redis");

const client = redis.createClient();
client.connect();

class StorageProvider {
  constructor(prefix) {
    this.prefix = prefix + "_";
  }

  async SAdd(key, value) {
    return await client.SADD(this.prefix + key, value);
  }

  async SRem(key, value) {
    return await client.SREM(this.prefix + key, value);
  }

  async SMembers(key) {
    return await client.SMEMBERS(this.prefix + key,);
  }
  
};

module.exports = StorageProvider;