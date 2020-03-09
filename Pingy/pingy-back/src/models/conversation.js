import mongoose, {Schema} from 'mongoose';

const conversationSchema = new mongoose.Schema({
    messages: {
        type: [Schema.Types.ObjectId], 
        ref: 'Message',
    },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;