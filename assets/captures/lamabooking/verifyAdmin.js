export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user.admin) {
            next();
        } else {
            return next(create_error(403, "You are not authorized"));
        }
    });
};
