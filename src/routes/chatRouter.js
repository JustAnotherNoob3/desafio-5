import { Router } from "express";
import chatManager from '../dao/Managers/ChatManager.js';
import { __dirname } from "../utils.js";

const chatRouter = Router();

chatRouter.get("/", async (req, res) => {
    try {
        let offset = req.query.offset;
        if (!offset || isNaN(offset)) offset = 0;
        let limit = req.query.limit;
        let msgArray = await chatManager.getMessages();
        if (isNaN(limit)) return res.status(200).send({ status: "success", payload: msgArray });
        let limitArray = msgArray.slice(offset, Number(limit) + offset);
        res.status(200).send({ status: "success", limitArray });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});
chatRouter.post("/", async (req, res) => {
    let msg = req.body;
    try {
        let id = await chatManager.addMessage(msg);
        res.status(200).send({ status: "success", payload: { id: id } });
        const io = req.app.get('socketio');
        io.emit("message_received", { id: id.toString(), message: msg });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});

chatRouter.put("/:pid", async (req, res) => {
    let msg = req.body.content;
    let msgToChange = req.params.pid;
    try {
        await chatManager.updateContent(msgToChange, msg);
        res.status(200).send({ status: "success" });
        const io = req.app.get('socketio');
        io.emit("message_updated", { id: msgToChange, message: msg });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});
chatRouter.delete("/clean", async (req, res) => {
    try {
        await chatManager.cleanMessages();
        res.status(200).send({ status: "success" });
        const io = req.app.get('socketio');
        io.emit("chat_cleansed");
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});
chatRouter.delete("/:pid", async (req, res) => {
    let msg = req.params.pid;
    try {
        await chatManager.deleteMessage(msg);
        res.status(200).send({ status: "success" });
        const io = req.app.get('socketio');
        io.emit("message_deleted", { id: msg });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});


export default chatRouter;