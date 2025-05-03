import { Router } from "express";
const router = Router();

import { getUserDetails, register, login, logout } from "../controllers/userController";


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", getUserDetails);

export default router;
