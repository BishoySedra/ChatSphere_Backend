//create a new schema for this
/*
    message
id                 UNIQUE
text             NOT NULL
imageUrl
user_id      NOT NULL
send_date NOT NULL
updated_date
*/
import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    sender_email: {
        type: String,
        required: true,
    },
    is_reply: {
        type: Boolean,
        default: false,
    },
    reply_to: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    reply_to_text: {
        type: Object,
        default: null,
    },
},
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export { messageSchema, Message }