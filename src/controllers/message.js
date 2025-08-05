import * as MessageService from "../services/message.js";
import { authorize } from "../middlewares/validator/authorize.js";

export const sendMessage = async (req, res, next) => {
  try {

    const { senderEmail, chatID } = req.params;

    const message = req.body.message;

    await authorize(req, res, next, senderEmail);

    const imageBuffer = req.file ? req.file.buffer : null;

    // check if there is a reply and reply_to is provided
    const is_reply = req.body.is_reply || false;
    const reply_to = is_reply ? req.body.reply_to : null;

    let sentMessage = await MessageService.sendMessage(
      senderEmail,
      chatID,
      message,
      imageBuffer,
      is_reply ? true : false,
      reply_to ? reply_to : null
    );

    return res
      .status(200)
      .json({
        body: sentMessage,
        message: "Message sent successfully",
        status: 200,
      });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { senderEmail, chatID, messageID } = req.params;
    await authorize(req, res, next, senderEmail);
    await MessageService.deleteMessage(senderEmail, chatID, messageID);
    return res
      .status(200)
      .json({
        body: null,
        message: "Message deleted successfully",
        status: 200,
      });
  } catch (error) {
    next(error);
  }
};
