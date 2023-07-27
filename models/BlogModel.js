import { Schema, Types, model } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        minlength: 5
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 550
    },
    author: {
        type: Types.ObjectId,
        ref: "User"
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // ? implement this: count of likes, (only one per user, and also who has liked)

}, {
    timestamps: true // createdAt & updatedAt
});

const Blog = model("Blog", blogSchema);
export default Blog;