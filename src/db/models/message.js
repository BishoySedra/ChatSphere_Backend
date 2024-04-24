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
},
 { timestamps: true }
);
    
const Message = mongoose.model("Message", messageSchema);
export default Message