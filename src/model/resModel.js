class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') { // 兼容处理，可以传对象类型的data + 字符串类型的message; 也可以只传message
            this.message = data
            this.data = null
            data = null
            message = null
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.error = 0
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.error = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}