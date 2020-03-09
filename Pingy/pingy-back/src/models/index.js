import mongoose from 'mongoose';
import User from './user.js';
import Conversation from './conversation.js';
import Message from './message.js';

const connectDb = async () => {
    let connection = await mongoose.connect(process.env.DATABASE_URL);
    return connection;
};

const models = {
    User,
    Conversation,
    Message,
}

export {connectDb};

export default models;