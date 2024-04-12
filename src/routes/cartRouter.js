import { Router } from "express";
import cartManager from '../dao/Managers/CartManager.js';
import { __dirname } from "../utils.js";

const cartRouter = Router();

cartRouter.get("/:cid", async (req, res) => {
    let id = req.params.cid;
    try{
        let cart = await cartManager.getCartById(id);
        res.status(200).send({status: "success", payload: cart});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});

cartRouter.post("/", async (req, res) => {
    try {
        let id = await cartManager.createNewCart();
        res.status(200).send({status: "success", payload: {id: id}});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    let qMany = req.body.quantity;
    try {
        let quantity = await cartManager.addProductToCart(cid, pid, qMany);
        res.status(200).send({status: "success", payload: {quantity: quantity}});
    } catch (error) {
        console.log({status: "error", error: error.toString()});
        res.status(400).send({status: "error", error: error.toString()});
    }
});
cartRouter.put("/:cid/products/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    let qMany = req.body.quantity;
    try {
        await cartManager.setProductQuantity(cid, pid, qMany);
        res.status(200).send({status: "success"});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});
cartRouter.put("/:cid", async (req, res) => {
    let cid = req.params.cid;
    let products = req.body;
    try {
        await cartManager.setProducts(cid, products);
        res.status(200).send({status: "success"});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    try {
        await cartManager.deleteProduct(cid, pid);
        res.status(200).send({status: "success"});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});
/*cartRouter.delete("/:cid/products", async (req, res) => {
    let cid = req.params.cid;
    try {
        await cartManager.deleteProducts(cid);
        res.status(200).send({status: "success"});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});*/
cartRouter.delete("/:cid", async (req, res) => {
    let cid = req.params.cid;
    try {
        await cartManager.deleteProducts(cid); //change to deleteCart
        res.status(200).send({status: "success"});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});
cartRouter.get("/", async (req, res) => {
    try {
        
        res.status(200).send({payload:await cartManager.getCarts(), status: "success"});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});
export default cartRouter;