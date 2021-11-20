const { set, get } = require('../db/redis')
const { userLogin } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const userRouter = (req, res) => {
    const { method, path, body } = req

    if (method === 'POST' && path === '/api/user/login') {
        return userLogin(body).then(data => {
            if (data.username) {
                // 设置session
                req.session.username = data.username
                // 同步到redis
                set(req.sessionId, req.session)

                return new SuccessModel(data, '登陆成功')
            } else {
                return new ErrorModel('登陆失败')
            }
        }).catch(data => new ErrorModel(data))
    }
}

module.exports = userRouter