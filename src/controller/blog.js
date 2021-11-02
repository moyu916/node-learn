const getBlogList = (author, keyword) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const list = {
                id: 1,
                title: '这是一篇博客',
                content: '这是博客的内容',
                createTime: 1635819417620,
                author: 'lqy'
            }
            resolve(list)
        }, 1000)
    })
}

const getBlogDetail = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const detail = {
                id: 1,
                title: '这是一篇博客',
                content: '这是博客的内容',
                createTime: 1635819417620,
                author: 'lqy'
            }
            if (id === detail.id) {
                resolve(detail)
            } else {
                reject('博客不存在')
            }     
        }, 1000)
    })
}

const newBlog = (blogData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                resolve('新增博客成功')
            } else {
                reject('新增博客失败')
            }          
        }, 1000)
    })
}

const updateBlog = (id, data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const detail = {
                id: 1,
                title: '这是一篇博客',
                content: '这是博客的内容',
                createTime: 1635819417620,
                author: 'lqy'
            }
            if (id === detail.id) {
                detail.content = data
                resolve(`博客更新成功, 更新内容为${detail.content}`)
            } else {
                reject('博客不存在')
            }     
        }, 1000)
    })
}

const delBlog = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const detail = {
                id: 1,
                title: '这是一篇博客',
                content: '这是博客的内容',
                createTime: 1635819417620,
                author: 'lqy'
            }
            if (id === detail.id) {
                resolve('博客删除成功')
            } else {
                reject('博客删除失败')
            }     
        }, 1000)
    })
}

module.exports = {
    getBlogList,
    getBlogDetail,
    newBlog,
    updateBlog,
    delBlog
}