const { get, set } = require('./db/redis')
const blogRouter = require('./router/blogRouter')
const userRouter = require('./router/userRouter')

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString() is ', d.toGMTString())
    return d.toGMTString()
}

// 对client端传来的post数据做处理
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'].indexOf('application/json') === -1) {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
}

const serverHandle = (req, res) => {
    const { method, url } = req

    res.setHeader('Content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8001');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许服务器端发送Cookie数据
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Set-Cookie')

    // 处理OPTIONS请求
    if (method === 'OPTIONS') {
        res.writeHead(200, {"Content-type": "text/plain"})
        res.end()
        return
    }

    req.path = url.split('?')[0]
    req.query = new URLSearchParams(url.split('?')[1])

    req.cookie = {}
    const cookieStr = req.headers.cookie || '' // k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach(item => {
        if(!item) return // cookieStr为''的时候

        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    // 解析session（使用redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId // userId之前做过处理，这里一定能取到，并且redis中已经有这个id了
    get(req.sessionId).then(sessionData => {
        // console.log('session', sessionData)
        if (sessionData == null) {
            set(req.sessionId, {})
            res.session = {}
        } else {
            req.session = sessionData
        }
        return getPostData(req)
    })
    .then(body => {
        req.body = body
        // console.log('body', body)

        // 命中blog模块路由
        const blogResult = blogRouter(req, res)
        if (blogResult) {
            blogResult.then(data => {
                // console.log('d', data)
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(data)
                )
            })
            return
        }

        // 命中user模块路由
        const userResult = userRouter(req, res)
        // console.log('userResult', userResult)
        if (userResult) {
            userResult.then(data => {
                // console.log('d', data)
                // console.log('need', needSetCookie)
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(data)
                )
            })
            return
        }


        // 未命中路由，返回404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 Not Found\n")
        res.end()
    })


}

module.exports = serverHandle