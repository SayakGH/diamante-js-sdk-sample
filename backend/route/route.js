import express from "express";
import {login , register} from "../controller/user-controller.js"

const router = express.Router();

router.post("/login", login);
router.post("/register",register);


module.exports = router;