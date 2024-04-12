export function authed(req, res, next){
    if(req.session && req.session.user)
    return next();
    return res.status(401).send({ status: "error", error: "Unauthorized" });
}
export function notAuthed(req, res, next){
    if(!req.session || !req.session.user) return next();
    res.redirect("/products");
}