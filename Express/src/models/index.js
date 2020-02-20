import mongoose from 'mongoose';
import User from './user';
import Message from './message';

const connectDb = () => {
  let connection = mongoose.connect(process.env.DATABASE_URL);
  return connection;
};

const models = {User, Message};

export { connectDb };

export default models;