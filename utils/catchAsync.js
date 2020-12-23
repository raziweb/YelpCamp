//utility function to wrap around async functions to catch error
module.exports = func => {
    return (req, res, next)=> {
        func(req, res, next).catch(e => next(e));
    }
}