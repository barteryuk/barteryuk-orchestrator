function customError(cd, msg) {
    let err = new Error()
    err.code = cd
    err.message = msg
    return err
}

module.exports = {customError}