
import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    senderEmail: {
        type: String,
        required: true,
    },
    receiverEmail: {
        
        type: String,
        required: true,
    }
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;