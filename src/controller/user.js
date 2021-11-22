const { exec, escape } = require('../db/mysql')
const _ = require('lodash')
const { genPassword } = require('../utils/cryp')

const userLogin = (data) => {
    let { username, password } = data
    username = escape(username)
    password = escape(genPassword(password))

    const sql = `
        select username from users where username=${username} and password=${password}
    `
    return exec(sql).then(rows => {
        return rows[0]
    })
}

module.exports = {
    userLogin
}