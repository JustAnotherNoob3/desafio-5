import {msgsModel} from "../models/messages.js"
import mongoose from "mongoose";
import { __dirname } from '../../utils.js';

class ChatManager {
    async addMessage(message) {
        let newMessage = new msgsModel(message);
        await newMessage.save();
        return newMessage._id;
    }
    async updateContent(messageId, content) {
        if((await msgsModel.updateOne(
            {_id: messageId}, {message: content}
            )).n == 0
          ) throw Error("No message with ID "+messageId);
        }
    async deleteMessage(messageId) {
        if((await msgsModel.deleteOne({_id:messageId})).deletedCount == 0) throw Error("No message with ID "+messageId);
    }
    async getMessages() {
        let products = await msgsModel.find();
        return products;
    }
    async cleanMessages(){
        await msgsModel.deleteMany({});
    }
}

const chatManager = new ChatManager();
export default chatManager;


