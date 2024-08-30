
class ErrorMessage extends Error{
    constructor(message) {
        super(message);
        this.message = message
    }

    get_message(){
        return this.message
    }
}

exports.ErrorMessage = ErrorMessage