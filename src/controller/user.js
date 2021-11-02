const _ = require('lodash')
const userLogin = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userData = {
                userName: 'lqy',
                password: '123456'
            }
            if (_.isEqual(data, userData)) {
                resolve('登陆成功')
            } else {
                reject('用户名或密码错误, 登陆失败')
            }
        }, 1000)
    })
}

module.exports = {
    userLogin
}