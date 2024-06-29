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
        defalut:NULL,
        required: false,
    },
    hosting: {
        type: String,
        defalut:NULL,
        required: false,
    },
    organising: {
        type: String,
        defalut:NULL,
        required: false,
    },

    publicKey: {
        type: String,
        required: true,
    },
    ssecret: {
        type: String,
        required: true,
    }
});

const User  = mongoose.model("user", userSchema);
export default User;