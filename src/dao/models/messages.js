import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;

const collection = "Messages";

const schema = new Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

schema.plugin(mongoosePaginate);
const msgsModel = mongoose.model(collection, schema);
export { msgsModel };