import mongoose from "mongoose";
const { Schema } = mongoose;

const groupChatSchema = new Schema({
    chat_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    group_name: {
        type: String,
        required: true,
    },
    group_description: {
        type: String
    },
    admin_email: {
        type: String,
        required: true,
    },
},
 { timestamps: true }
);
const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat;