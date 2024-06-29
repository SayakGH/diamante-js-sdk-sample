import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    HashPassword: {
        type: String,
        unique: true,
        required: true
    },
    participating: {
        type: String,
        defalut:"",
        required: false,
    },
    organising: {
        type: String,
        defalut:"",
        required: false,
    },

    publicKey: {
        type: String,
        required: true,
    },
    secret: {
        type: String,
        required: true,
    }
});

const User  = mongoose.model("user", userSchema);
export default User;