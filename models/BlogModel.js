const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
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
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // ? implement this: count of likes, (only one per user, and also who has liked)

}, {
    timestamps: true // createdAt & updatedAt
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;