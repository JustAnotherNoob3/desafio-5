import { Router } from "express";
import productManager from '../dao/Managers/ProductManager.js';
import { __dirname } from "../utils.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    try {
        let limit = req.query.limit ?? 10;
        let page = req.query.page || 1;
        let productArray = await productManager.getProducts(limit,page,req.query.query,req.query.sort);
        let fullUrl = req.protocol + '://' + req.get('host') + req.baseUrl+ `?limit=${limit}`
        
        if(req.query.sort) fullUrl+= `&sort=${req.query.sort}`;
        if(req.query.query) fullUrl+= `&query=${req.query.query}`;
        res.status(200).send({ status: "success", payload: productArray.docs, totalPages: productArray.totalPages, page: productArray.page, hasPrevPage: productArray.hasPrevPage, hasNextPage: productArray.hasNextPage, prevPage: productArray.prevPage, nextPage:productArray.nextPage, prevLink: productArray.hasPrevPage ? fullUrl+`&page=${productArray.prevPage}` : null,nextLink: productArray.hasNextPage ? fullUrl+`&page=${productArray.nextPage}` : null});
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});

productsRouter.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        let product = await productManager.getProductById(id);
        res.status(200).send({ status: "success", payload: await product });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});

productsRouter.post("/", async (req, res) => {
    let product = req.body;
    try {
        let id = await productManager.addProduct(product);
        res.status(200).send({ status: "success", payload: { id: id } });
        const io = req.app.get('socketio');
        io.emit("addProduct", { id: id.toString(), product: product });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});

productsRouter.put("/:pid", async (req, res) => {
    let product = req.body;
    let productToChange = req.params.pid;
    try {
        await productManager.updateProduct(productToChange, product);
        res.status(200).send({ status: "success" });
        const io = req.app.get('socketio');
        io.emit("updateProduct", { id: productToChange, product: product });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    let product = req.params.pid;
    try {
        await productManager.deleteProduct(product);
        res.status(200).send({ status: "success" });
        const io = req.app.get('socketio');
        io.emit("deleteProduct", { id: product });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.toString() });
    }
});

export default productsRouter;