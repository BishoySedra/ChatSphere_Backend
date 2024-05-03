import * as MessageService from '../services/message.js';
import {authorize} from '../middlewares/validator/authorize.js';

export const sendMessage = async (req, res, next) => {
    try {
        const { senderEmail, chatID } = req.params;
        const { message } = req.body;
        await authorize(req,res,next,senderEmail);
        await MessageService.sendMessage(senderEmail, chatID, message);
        return res.status(200).json({body: null , message: "Message sent successfully", status: 200});
    } catch (error) {
        next(error);
    }
}

export const deleteMessage = async (req, res, next) => {
    try {
        const { senderEmail, chatID, messageID } = req.params;
        await authorize(req,res,next,senderEmail);
        await MessageService.deleteMessage(senderEmail, chatID, messageID);
        return res.status(200).json({body: null , message: "Message deleted successfully", status: 200});
    } catch (error) {
        next(error);
    }
}