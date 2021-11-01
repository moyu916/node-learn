const blogRouter = require('./router/blogRouter')
const userRouter = require('./router/userRouter')

const serverHandle = (req, res) => {
    const { method, url } = req

    req.path = url.split('?')[0]
    req.query = new URLSearchParams(url.split('?')[1])

    const blogData = blogRouter(req, res)
    const userData = userRouter(req, res)

}

module.exports = serverHandle