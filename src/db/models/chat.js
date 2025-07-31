
import mongoose from "mongoose";
import { messageSchema } from "../models/message.js"
const { Schema } = mongoose;


const chatSchema = new Schema({
    users: {
        type: [String],
        required: true,
    },
    messages: {
        type: [messageSchema],
        ref: "Message",
    },
    chat_type: {
        type: String,
        enum: ["PRIVATE", "GROUP"],
    },
    userDetails: {
        type: [Object],
        default: [],
    },
},
    { timestamps: true }
);
const Chat = mongoose.model("Chat", chatSchema);

export default Chat;