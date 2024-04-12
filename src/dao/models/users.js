import mongoose from "mongoose";
const { Schema } = mongoose;

const collection = "Users";

const schema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = mongoose.model(collection, schema);
export { userModel };