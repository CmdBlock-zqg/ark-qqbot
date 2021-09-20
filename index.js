const http = require('http')

require('./routines')()
const conf = require('./conf')
const route = require('./modules')

const server = http.createServer()
server.on('request', (req, resp) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
        body = JSON.parse(body)
        if (body.post_type !== 'message') return
        if (conf.ban.indexOf(body.sender.user_id) !== -1) return
        route(body.message, body.sender.user_id, body.temp_source | body.group_id | body.sender.group_id, body.message_type)
    })
    resp.end()
})

server.listen(conf.cqhttp.listen)