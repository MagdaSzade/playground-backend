module.exports = function asyncMiddleware(hendler) {
    return async (req, res, next) => {
        try {
            await hendler();
        } catch(error) {
            next(error);
        }
    }
}