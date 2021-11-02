const { 
    getBlogList, 
    getBlogDetail, 
    newBlog, 
    updateBlog, 
    delBlog 
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const blogRouter = (req, res) => {
    const { method, path, query, body } = req
    const id = Number(query.get('id')) || body.id

    // 获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {
        const author = query.get('author')
        const keyword = query.get('keyword')
        return getBlogList(author, keyword)
            .then(listData => new SuccessModel(listData, '获取博客列表成功'))
            .catch(err => new ErrorModel(err))
    }

    // 获取一篇博客的内容
    if (method === 'GET' && path === '/api/blog/detail') {
        return getBlogDetail(id).then(detailData => new SuccessModel(detailData, `成功获取id为${id}的博客`))
                                .catch(err => new ErrorModel(err))
    }

    // 新增一篇博客
    if (method === 'POST' && path === '/api/blog/new') {
        return newBlog(body).then(msg => new SuccessModel(msg))
                            .catch(msg => new ErrorModel(msg))
    }
    // 更新一篇博客
    if (method === 'POST' && path === '/api/blog/update') {
        return updateBlog(id, body.data).then(msg => new SuccessModel(msg))
                                    .catch(err => new ErrorModel(err))
    }
    // 删除一篇博客
    if (method === 'POST' && path === '/api/blog/del') {
        return delBlog(id).then(msg => new SuccessModel(msg, '删除博客成功'))
                            .catch(err => new ErrorModel(err))
    }
}

module.exports = blogRouter