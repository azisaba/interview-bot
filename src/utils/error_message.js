
class ErrorMessage extends Error{
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message
    }

    get_message(){
        return this.message
    }
}

/**
 * @enum {string}
 */
const ErrorCode = {
    ExistChannel: "ExistChannel",
    FailToGetCategory: "FailToGetCategory",
    FailToCreateChannel: "FailToCreateChannel",
    NotExistChannel: "NotExistChannel",
    NotExistGroupSign: "NotExistGroupSign",
    AlreadyArchivedChannel: "AlreadyArchivedChannel",
    NotAllowedWord: "NotAllowedWord"
}

exports.ErrorMessage = ErrorMessage
exports.ErrorCode = ErrorCode
