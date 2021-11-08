const { 
    getBlogList, 
    getBlogDetail, 
    newBlog, 
    updateBlog, 
    delBlog 
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

const blogRouter = (req, res) => {
    const { method, path, query, body } = req
    const id = Number(query.get('id')) || body.id

    // 获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        const author = query.get('author') // 如果为空会返回undefined, 因此不需要兼容处理
        const keyword = query.get('keyword')
        return getBlogList(author, keyword)
            .then(listData => {
                if (listData.length) {
                    return new SuccessModel(listData, '获取博客列表成功')
                } else {
                    return new ErrorModel('您查找的博客列表不存在')
                }
            }).catch(err => new ErrorModel(err))
    }

    // 获取一篇博客的内容
    if (method === 'GET' && path === '/api/blog/detail') {
        return getBlogDetail(id).then(detailData => {
            if (detailData) {
                return new SuccessModel(detailData, `成功获取id为${id}的博客`)
            } else {
                return new ErrorModel('您要获取的博客不存在')
            }
        }).catch(err => new ErrorModel(err))
    }

    // 新增一篇博客
    if (method === 'POST' && path === '/api/blog/new') {

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        req.body.author = req.session.username
        return newBlog(body).then(data => new SuccessModel(data, `成功新增id为${data.id}的博客`))
                            .catch(err => new ErrorModel(err, '新增博客失败'))
    }
    // 更新一篇博客
    if (method === 'POST' && path === '/api/blog/update') {

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }

        return updateBlog(id, body).then(msg => new SuccessModel(msg))
                                    .catch(err => new ErrorModel(err))
    }
    // 删除一篇博客
    if (method === 'POST' && path === '/api/blog/del') {

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        
        return delBlog(id).then(boolData => {
            if (boolData) {
                return new SuccessModel(boolData, '删除博客成功')
            } else {
                return new ErrorModel(boolData, '删除博客失败')
            }
        }).catch(err => new ErrorModel(err, '删除博客失败'))
    }
}

module.exports = blogRouter