import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;

const collection = "Carts";

const schema = new Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
    }]
});
schema.pre('findOne', function () {
    this.populate('products.product')
});
schema.plugin(mongoosePaginate);
const cartsModel = mongoose.model(collection, schema);
export { cartsModel };