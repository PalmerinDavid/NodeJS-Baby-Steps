import mongoose, {Schema} from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
    },
    text: String,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;