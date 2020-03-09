import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        unique: true,
    },
    level : {
        type: Number,
        min: 1,
        max: 5,
    },
    location: {
        type : {type: String},
        coordinates : [Number]
    },
    conversations: {
        type: [Schema.Types.ObjectId],
        ref: 'Conversation',
    },
});

userSchema.statics.findByLogin = async function (login) {
    let user = await this.findOne({
        username: login,
    });
    if (!user)
        user = await this.findOne({ email: login });
    return user;
}

userSchema.index({ location : "2dsphere"});

const User = mongoose.model('User', userSchema);

export default User;

