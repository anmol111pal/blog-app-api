import { Request, Response } from "express";
import Blog from "../models/Blog";
import User from "../models/User";
import loggedInUsers from "../utils/login";

export const getBlog = async (req: Request, res: Response) => {
    const _id = req.params.id;
    try {
        const blog = await Blog.findOne({_id}, {_id: 0, title: 1, content: 1, author: 1, likes: 1, createdAt: 1, updatedAt: 1});
        res.status(200).send({
            code: 200,
            blog
        });
    } catch(err) {
        res.status(500).send({
            code: 500,
            message: "Could not fetch the requested blog."
        });
    }
}

export const getAllBlogs = async (req: Request, res: Response) => {
    if(req.cookies.user_id) {
        const blogs = await Blog.find({}, {_id: 0, title: 1, content: 1, author: 1, likes: 1, createdAt: 1}); // all blogs
        res.status(200).send({
            code: 200,
            blogs
        });
    } else {
        res.status(401).send({
            code: 401,
            message: "Auth error"
        });
    }
}

export const getMyBlogs = async (req: Request, res: Response) => {
    if(req.cookies.user_id) {
        const user_id = loggedInUsers.get(req.cookies.user_id);
        const blogs = await Blog.find({_id: user_id}, {_id: 0, title: 1, content: 1, likes: 1, createdAt: 1});
        res.status(200).send({
            code: 200,
            blogs
        });

    } else {
        res.status(401).send({
            code: 401,
            message: "Auth error"
        });
    }
}

export const write = async (req: Request, res: Response) => {
    if(req.cookies.user_id) {
        const {title, content} = req.body;
        const user_id = loggedInUsers.get(req.cookies.user_id);
        
        try {
            // create a blog
            const blog = await Blog.create({title, content, author: user_id});
            console.log("Blog published!");
            // update the user doc with the id of the blog's id
            const result = await User.updateOne({ _id: user_id }, { $push: { posts: blog._id } });
            if(result.modifiedCount !== 1) {
                throw new Error("Error while updating user-doc with blog-id.");
            }
            //? Implement the above feature using aggregation

            // at the end, redirect to the /api/blogs/:id page (blog's page)
            res.redirect(`/api/blogs/${blog._id}`);
        } catch(err) {
            console.log("Error while publishing blog:", err);
            res.status(401).send({
                code: 401,
                message: "Could not publish the blog."
            });
        }
    } else {
        res.status(401).send({
            code: 401,
            message: "Auth error"
        });
    }
}
