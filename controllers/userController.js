import shortid from "shortid";
import User from "../models/UserModel.js";
import loggedInUsers from "./login.js";

const getUserDetails = async (req, res) => {
    if(req.cookies.user_id) {
        const user_id = loggedInUsers.get(req.cookies.user_id);
        const user = await User.findOne({_id: user_id}, {username: 1, name: 1, email: 1, posts: 1, _id: 0});

        res.status(200).send(user);
    } else {
        res.status(401).send({
            code: 401,
            message: "Auth error."
        });
    }
}

const register = async (req, res) => {
    const user = req.body;

    const createdUser = await User.create(user);

    const user_id = shortid.generate();
    loggedInUsers.set(user_id, createdUser._id.toString());
    res.cookie("user_id", user_id);
    console.log(`${user.name} logged in`);
    res.status(200).send({
        user
    });
}

const login = async (req, res) => {
    const {username, password} = req.body;

    const userMatch = await User.findOne({username, password}) || null;
    if(userMatch === null) {
        console.log("Error logging in.");
        res.status(401).send({
            code: 401,
            message: "Invalid credentials!"
        });
    } else {
        console.log(`${userMatch.name} logged in`);
        const user_id = shortid.generate();
        loggedInUsers.set(user_id, userMatch._id.toString());
        res.cookie("user_id", user_id);
        res.status(200).send({
            userMatch
        });
    }
}

const logout = async (req, res) => {
    if(req.cookies.user_id) {
        res.clearCookie("user_id");
        loggedInUsers.delete(req.cookies.user_id);
        res.status(200).send({
            code: 200,
            message: "Logged out successfully."
        });
    } else {
        res.status(401).send({
            code: 401,
            message: "Auth error."
        });
    }
}

export {
    getUserDetails, register, login, logout
};
