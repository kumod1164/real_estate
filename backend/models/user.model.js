import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png",
    },

    }, { timestamps: true });

    const User = mongoose.model("User", userSchema);

 export default User;