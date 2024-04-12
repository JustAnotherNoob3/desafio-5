import { Router } from "express";
import { __dirname } from "../utils.js";
import productManager from '../dao/Managers/ProductManager.js';
import chatManager from "../dao/Managers/ChatManager.js";
import cartManager from "../dao/Managers/CartManager.js";
import { authed, notAuthed } from "../auth.js";

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  if(req.session && req.session.user) return res.redirect("/products");
  return res.redirect("/login")
});
viewsRouter.get("/register", notAuthed, (req, res) => {
  res.render("register");
});

viewsRouter.get("/login", notAuthed,(req, res) => {
  res.render("login");
});
viewsRouter.get("/products-old", authed, async (req, res) => {
  let products = (await productManager.getProducts(9999)).docs.map((x) => {
      let p = x.toObject();
      return {id: p._id.toString(), title: p.title, pair: Object.keys(p).map((obj, i) => {if(obj=="__v")return undefined;return {key: toTitleCase(obj), value:Object.values(p)[i]}})}
  });
  res.render("home", {product: products});
});

viewsRouter.get("/products", authed, async (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host') + "/products";
  let p = await productManager.getProducts(5, req.query.page);
  let products = p.docs.map((x) => {
      let p = x.toObject();
      return {id: p._id.toString(), title: p.title, url: fullUrl+"/"+p._id}
  });
  res.render("products", {user: req.session.user,product: products, page: p.page, hasNext: p.hasNextPage, hasPrev: p.hasPrevPage, prevUrl: fullUrl + "?page=" + p.prevPage,nextUrl: fullUrl + "?page=" + p.nextPage});
});

viewsRouter.get("/products/:pid", authed, async (req, res) => {
  let id = req.params.pid;
  let p = (await productManager.getProductById(id)).toObject();
  res.render("product", {id: id, title: p.title, pair: Object.keys(p).map((obj, i) => {if(obj=="__v" || obj == "title")return undefined;return {key: toTitleCase(obj), value:Object.values(p)[i]}})});
});

viewsRouter.get("/realtimeproducts", authed, async (req, res) => {
  let products = (await productManager.getProducts()).docs.map((x) => {
    let p = x.toObject();
    return {id: p._id.toString(), title: p.title, pair: Object.keys(p).map((obj, i) => {if(obj=="__v")return undefined;return {key: toTitleCase(obj), value:Object.values(p)[i]}})}
    });
    res.render("realTimeProducts",{product: products});
});

viewsRouter.get("/carts/:cid", authed, async (req, res) => {
      let id = req.params.cid;
      let cart = (await cartManager.getCartById(id)).toObject();
      res.render("cart",{id: id, product: cart.products.map((x) => {return {quantity: x.quantity, title: x.product.title, id: x.product._id, description: x.product.description}})});
});

viewsRouter.get("/chat", authed, async (req, res) => {
  let msgs = (await chatManager.getMessages()).map((x) => x.toObject());
  console.log(msgs);
    res.render("chat",{messages: msgs});
});

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

export default viewsRouter;