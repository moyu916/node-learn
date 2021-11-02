const blogRouter = require('./router/blogRouter')
const userRouter = require('./router/userRouter')

// 对client端传来的post数据做处理
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
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

    req.path = url.split('?')[0]
    req.query = new URLSearchParams(url.split('?')[1])

    getPostData(req).then(body => {
        req.body = body

        // 命中blog模块路由
        const blogResult = blogRouter(req, res)
        if (blogResult) {
            blogResult.then(data => res.end(
                JSON.stringify(data)
            ))
        }

        // 命中user模块路由
        const userResult = userRouter(req, res)
        if (userResult) {
            userResult.then(data => res.end(
                JSON.stringify(data)
            ))
        }
    })


}

module.exports = serverHandle