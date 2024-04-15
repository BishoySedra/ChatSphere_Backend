import jwt from "jsonwebtoken"
import env from "dotenv"

env.config()


export const generateToken = (email) => {
    const payload = {
        email
    }
    const secret = process.env.JWT_SECRET
    const options = { expiresIn: '1y' }

    return jwt.sign(payload, secret, options)
}

export const verifyAccessToken = (token) => {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret);
}