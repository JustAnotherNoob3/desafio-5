import fs from 'node:fs';
import { __dirname } from '../utils.js';

class CartManager {
    #path;
    constructor(path) {
        this.#path = path;
        if (!fs.existsSync(path)) fs.writeFileSync(path, "[]");
    }
    async createNewCart() {
        let carts = this.#getCarts();
        let cart = {
            id: this.#generateNewId(carts),
            products: []
        };
        carts.push(cart);
        this.#saveCartsToFile(carts)
        return cart.id;
    }
    async addProductToCart(cartId, productId) {
        let carts = this.#getCarts();
        if (this.#argumentsHaveFalsyNotZero([cartId, productId])) {
            throw Error(`There were values undefined. Not adding product ${productId} to cart ${cartId}`);
        }
        let index = carts.findIndex((element) => element.id == cartId);
        if (index == -1) {
            throw Error(`No cart with id ${cartId}`);
        }
        let cart = carts[index];
        let pIndex = cart.products.findIndex((element) => element.product == productId)
        let quantity;
        if (pIndex == -1) {
            quantity = 1;
            let product = {
                product: productId,
                quantity: 1
            };
            cart.products.push(product)
        } else {
            cart.products[pIndex].quantity++;
            quantity = cart.products[pIndex].quantity;
        }
        carts[index] = cart;
        this.#saveCartsToFile(carts);
        return quantity;
    }
    /*async deleteProduct(productId) {
        let products = this.getProducts();
        let index = products.findIndex((element) => element.id === productId);
        if (index === -1) {
            throw Error(`No product with id ${productId} was found.`);
        }
        products.splice(index, 1);
        this.#saveProductsToFile(products);
    }*/
    #getCarts() {
        let carts = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
        return carts;
    }
    async getCartById(cartId) {
        let carts = this.#getCarts()
        const cart = carts.findIndex(
            (element) => element.id == cartId
        );
        if (cart === -1) {
            throw Error(`No cart with id ${cartId}`);
        }
        return carts[cart];

    }

    #saveCartsToFile(carts) {
        let jsonString = JSON.stringify(carts);
        fs.writeFileSync(this.#path, jsonString);
    }
    #argumentsHaveFalsyNotZero(arr) {
        let isFalsy = false;
        arr.forEach((element) => {
            if (!element && element !== 0) isFalsy = true;
        });
        return isFalsy;
    }
    #generateNewId(arr) {
        if (arr.length === 0) return 1;
        return arr[arr.length - 1].id + 1;
    }
}


const cartManager = new CartManager(__dirname + "/data/carrito.json");

export default cartManager;


