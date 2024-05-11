
import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    senderEmail: {
        type: String,
    },
    receiverEmail: {
        
        type: String,
    }
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;