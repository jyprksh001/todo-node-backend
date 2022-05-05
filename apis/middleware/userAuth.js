import jwt from "jsonwebtoken";
export const isAuthenticated = (req, res, next)=>{
    const token=req.header('x-auth-token');
    if (!token) return res.status(401).send({"status": false, "code": 401, "msg": "TOKEN_NOT_FOUND"});
    try{
        const decodedTokenData=jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedTokenData)
        req.user=decodedTokenData 
        next();
    }
    catch(exception) {
        res.status(401).send({"msg": "INVALID_TOKEN"});
    }
}
