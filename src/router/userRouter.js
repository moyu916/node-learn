const { userLogin } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const userRouter = (req, res) => {
    const { method, path, body } = req

    if (method === 'POST' && path === '/api/user/login') {
        return userLogin(body).then(msg => new SuccessModel(msg))
                                .catch(msg => new ErrorModel(msg))
    }
}

module.exports = userRouter