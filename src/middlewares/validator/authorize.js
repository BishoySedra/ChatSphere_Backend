import * as jwt from "../../helpers/jwt.js";
import { createCustomError } from "../errors/customError.js"

export const authorize = async (req, res, next,expectedEmail) => {
    if(req.headers.authorization === undefined || req.headers.authorization === null) 
        throw new createCustomError("Unauthorized Access!", 401, null);
    //remove the Bearer and trim the token
    if(req.headers.authorization.split(" ")[0] !== "Bearer")
        throw new createCustomError("Unauthorized Token!!", 400, null);
    let token = req.headers.authorization.split(" ")[1];
    let tokenData
    try{
        tokenData = jwt.verifyAccessToken(token)
    }
    catch(err){
        //Cannot set headers after they are sent to the client
        res.status(400).json({message: "Error while verifying token!",body:null,status:400})
    }
    if(tokenData['0'].email !== expectedEmail){
        // console.log("HERE WRONG!")
        throw new createCustomError("Unauthorized Access!", 403, null);
    }
}
