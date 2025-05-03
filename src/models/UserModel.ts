import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        }
    ]
}, {
    timestamps: true // createdAt & updatedAt
});

const User = model("user", userSchema);
export default User;