const { exec } = require("../db/mysql")
const xss = require('xss')

const getBlogList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 ` // 留意最后的空格
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}' `
    }
    sql += `order by createtime desc;`

    // console.log('sql', sql)
    return exec(sql).then(listData => listData)
                    .catch(err => err)
}

const getBlogDetail = (id) => {
    let sql = `select title, content, createtime, author from blogs where id=${id};`
    return exec(sql).then(rows => rows[0])
                    .catch(err => err)
}

const newBlog = (blogData) => {
    let { title, content, author } = blogData
    title = xss(title)

    const createTime = Date.now()
    let sql = `
        insert into blogs (title, content, author, createtime)
        values ('${title}', '${content}', '${author}', ${createTime});
    `
    return exec(sql).then(data => {
        // console.log(data)
        return {
            id: data.insertId
        }
    }).catch(err => err)
}

const updateBlog = (id, data) => {
    const { title, content } = data

    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id};
    `
    return exec(sql).then(updateData => {
        // console.log(updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id) => {
    let sql = `delete from blogs where id='${id}';`
    return exec(sql).then(delData => {
        // console.log(delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getBlogList,
    getBlogDetail,
    newBlog,
    updateBlog,
    delBlog
}