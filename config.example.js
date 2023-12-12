module.exports = {
  ws: "ws://localhost:8081/",
  id: 0,
  modules: {
    123123123: {
      play: {},
      log: {},
      cf: {}
    },
    456456456: {
      play: {}
    }
  },
  services: {
    cf: {
      groups: [123123123]
    }
  }
};