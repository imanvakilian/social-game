function returnValidationErrorMsg(error) {
    // return error?.details?.[0]?.context?.error?.message;
    if(error?.details?.[0]?.context?.error?.message) return error?.details?.[0]?.context?.error?.message;
    return error?.message;
}

module.exports = {
    returnValidationErrorMsg,
}