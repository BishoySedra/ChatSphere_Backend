
import mongoose from "mongoose";
const { Schema } = mongoose;

const chatSchema = new Schema({
    users: {
        type: [String],
        required: true,
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    chat_type: {
        type: String,
        enum: ["PRIVATE", "GROUP"],
    },
},
 { timestamps: true }
);
const Chat = mongoose.model("Chat", chatSchema);

export default Chat;