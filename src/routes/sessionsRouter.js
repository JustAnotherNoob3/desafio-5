import { Router } from "express";
import { userModel } from '../dao/models/users.js';
import { __dirname } from "../utils.js";
const sessionsRouter = Router();

sessionsRouter.get("/logout", async (req, res) => {
    req.session.destroy(err => {
        if(err)return res.json({status: "error", error: err});
        res.send({status:"success"})
    })
});

sessionsRouter.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exist = await userModel.findOne({ email: email });
    if (exist) return res.status(400).send({ status: "error", error: "Email already registered" });
    const user = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        password: password
    }
    try {
        const result = await userModel.create(user);
        res.status(201).send({ status: "success", payload: result })
    } catch (err) {
        res.status(400).send({ status: "error", error: err.toString() })
    }
});
sessionsRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
        req.session.user = {
            name: `Admin`,
            email: user.email,
            age: "99",
            role: "admin"
        }
        return res.send({ status: "success", payload: req.session.user, message: "Inicio Exitoso" });
    }
    const user = await userModel.findOne({ email, password });
    if (!user) return res.status(400).send({ status: "error", error: "Email or password incorrect." });
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: "user"
    }
    res.send({ status: "success", payload: req.session.user, message: "Inicio Exitoso" });
});

export default sessionsRouter;