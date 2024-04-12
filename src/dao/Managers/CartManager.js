import fs from 'node:fs';
import mongoose from "mongoose";
import { cartsModel } from "../models/carts.js"
import { __dirname } from '../../utils.js';

class CartManager {

    async createNewCart() {
        let cart = {
            products: []
        };
        let newCart = await cartsModel.create(cart);
        return newCart._id;
    }
    async setProducts(cartId, products) {
        let cart = await this.getCartById(cartId);
        cart.products = products;
        await cart.save();
    }
    async deleteProduct(cartId, productId) {
        let cart = await this.getCartById(cartId);
        let pIndex = cart.products.findIndex((element) => { return element.product._id == productId });
        if (pIndex == -1) throw "No product with ID " + productId + "in the cart " + cartId;
        cart.products.splice(pIndex, 1);
        await cart.save();
    }
    async deleteProducts(cartId) {
        await this.setProducts(cartId, []);
    }
    async setProductQuantity(cartId, productId, quantity) {
        let cart = await this.getCartById(cartId);
        let pIndex = cart.products.findIndex((element) => { return element.product._id == productId });
        if (pIndex == -1) throw "No product with ID " + productId + "in the cart " + cartId;
        cart.products[pIndex].quantity = quantity;
        await cart.save();
    }
    async addProductToCart(cartId, productId, quantity) {
        quantity = quantity || 1;
        let cart = await this.getCartById(cartId);
        let pIndex = cart.products.findIndex((element) => { return element.product._id == productId });
        let quantity2;
        if (pIndex == -1) {
            quantity2 = quantity;
            let product = {
                product: productId,
                quantity: quantity
            };
            cart.products.push(product)
        } else {
            cart.products[pIndex].quantity += quantity;
            quantity2 = cart.products[pIndex].quantity;
        }
        await cart.save();
        return quantity2;
    }
    async deleteCart(cartId) {
        try { (await cartsModel.findByIdAndDelete(cartId)).errors } catch { throw "No cart with ID " + cartId; }
    }
    async getQuantityOfProduct(cartId, productId) {
        let cart = await this.getCartById(cartId);
        let pIndex = cart.products.find((element) => element.product == productId)
        if (pIndex) {
            return pIndex.quantity;
        } else {
            return 0;
        }
    }
    async createTestCarts(array) {
        let id = await this.createNewCart();
        let id2 = await this.createNewCart();
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (index < 5) {
                await this.addProductToCart(id, element, index)
                continue;
            }
            await this.addProductToCart(id2, element, index)
        }
    }
    async getCartById(cartId) {
        let cart = await cartsModel.findById(cartId);
        if (cart == undefined) {
            throw Error("No cart with ID " + cartId);
        }
        return cart;
    };
    //! ONLY FOR TESTING
    async getCarts(cartId) {
        let cart = await cartsModel.find();
        
        return cart;
    }
}


const cartManager = new CartManager();

export default cartManager;


