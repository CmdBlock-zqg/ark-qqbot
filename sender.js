const { default: axios } = require('axios')
const http = require('http')

const conf = require('./conf')

module.exports = {
    sendPrivateMessage: async (user, msg) => {
        try {
            await axios({
                method: 'POST',
                baseURL: conf.cqhttp.baseURL,
                url: '/send_private_msg',
                data: {
                    user_id: user,
                    message: msg
                }
            })
        } catch(err) {
            if (err.response) {
                console.log(`${Date.now()} ${err.response.status} ${err.response.data}`)
            } else {
                console.log(`${Date.now()} ${err.message}`)
            }
        }
    },
    sendGroupMessage: async (group, msg) => {
        try {
            await axios({
                method: 'POST',
                baseURL: conf.cqhttp.baseURL,
                url: '/send_group_msg',
                data: {
                    group_id: group,
                    message: msg
                }
            })
        } catch(err) {
            if (err.response) {
                console.log(`${Date.now()} ${err.response.status} ${err.response.data}`)
            } else {
                console.log(`${Date.now()} ${err.message}`)
            }
            
        }
    }
}