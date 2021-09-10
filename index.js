const http = require('http')

require('./routines')()
require('./arkData').update()
const handlers = require('./handlers')
const sender = require('./sender')
const conf = require('./conf')

const server = http.createServer()
server.on('request', (req, resp) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
        body = JSON.parse(body)
        let res
        if (body.post_type !== 'message') return
        if (body.message.indexOf('##') !== 0) return
        for (let i of Object.keys(handlers)) {
            if (body.message.indexOf(i) === 0) {
                res = handlers[i](body.message, body.sender.user_id)
                break
            }
        }
        if (!res) return
        if (body.message_type === 'private') {
            sender.sendPrivateMessage(body.user_id, res)
        } else if (body.message_type === 'group') {
            sender.sendGroupMessage(body.group_id, res)
        }
    })
    resp.end()
})

server.listen(conf.cqhttp.listen)