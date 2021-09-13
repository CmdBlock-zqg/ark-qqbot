const { default: axios } = require('axios')
const http = require('http')

const conf = require('./conf')

module.exports = {
    sendPrivateMessage: async (user, msg, group) => {
        if (typeof(msg) === 'string') {
            await axios({
                method: 'POST',
                baseURL: conf.cqhttp.baseURL,
                url: '/send_private_msg',
                data: {
                    user_id: user,
                    message: msg,
                    group_id: group
                }
            })
        } else {
            for (let i of msg) {
                await axios({
                    method: 'POST',
                    baseURL: conf.cqhttp.baseURL,
                    url: '/send_private_msg',
                    data: {
                        user_id: user,
                        message: i,
                        group_id: group
                    }
                })
            }
        }
    },
    sendGroupMessage: async (group, msg) => {
        if (typeof(msg) === 'string') {
            await axios({
                method: 'POST',
                baseURL: conf.cqhttp.baseURL,
                url: '/send_group_msg',
                data: {
                    user_id: group,
                    message: msg,
                    group_id: group
                }
            })
        } else {
            for (let i of msg) {
                await axios({
                    method: 'POST',
                    baseURL: conf.cqhttp.baseURL,
                    url: '/send_group_msg',
                    data: {
                        user_id: group,
                        message: i,
                        group_id: group
                    }
                })
            }
        }
    },
    sendGroupForwardMessage: async (group, msg) => {
        /*
        msg {
            uin: 
            name:
            content:
        }
        */
       try {
           await axios({
                method: 'POST',
                baseURL: conf.cqhttp.baseURL,
                url: '/send_group_forward_msg',
                data: {
                    group_id: group,
                    messages: msg.map((x) => {
                        return {
                            type: 'node',
                            data: x
                        }
                    })
                }
            })
       } catch(err) {
           console.log(err)
       }
        
    }
}