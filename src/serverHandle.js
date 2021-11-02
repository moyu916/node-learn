const blogRouter = require('./router/blogRouter')
// const userRouter = require('./router/userRouter')

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
        const blogResult = blogRouter(req, res)
        if (blogResult) {
            blogResult.then(data => res.end(
                JSON.stringify(data)
            ))
        }
    
        // const userResult = userRouter(req, res)
    })


}

module.exports = serverHandle