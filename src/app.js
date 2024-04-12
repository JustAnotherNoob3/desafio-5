import express from 'express'
import productsRouter from './routes/productsRouter.js';
import productManager from './dao/Managers/ProductManager.js';
import cartManager from './dao/Managers/CartManager.js';
import cartRouter from './routes/cartRouter.js';
import chatRouter from './routes/chatRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionsRouter from './routes/sessionsRouter.js';
import { __dirname } from './utils.js';
import handlebars from "express-handlebars";
import { Server } from 'socket.io';
import socketServerController from './socketServerController.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
const DB_URL = 'mongodb+srv://JustAnotherNoob:EaT3M8npz32eEUJw@cluster0.ellbwl0.mongodb.net/ecommerce?retryWrites=true&w=majority';
//const fileStorage = FileStore(session);
const connectMongoDB = async () => {
    try {
        await mongoose.connect(DB_URL)
        console.log("DB connected successfully!");
        /*if((await productManager.getProducts()).docs.length == 0){
            let a = await productManager.createTestProducts()
            cartManager.createTestCarts(a.map((val) => val.toString()));
        }*/
    } catch (err) {
        console.log("DB connection error: ", err);
    }
}



const port = 8030;
const app = express();
connectMongoDB();
//main
console.log(__dirname);
const httpServer = app.listen(port, () => console.log("running"));

//websocket
const socketServer = new Server(httpServer);
socketServerController(socketServer);
app.set('socketio', socketServer);

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("secret"));
app.use(session({
    //store: new fileStorage({path:__dirname+"/sessions",ttl:100,retries:0}),
    store: MongoStore.create({
        mongoUrl:DB_URL,
        ttl:3600,
        //mongoOptions:{useNewUrlParser:true, useUnifiedTopology:true}
    }),
    secret:'secret',
    resave:false,
    saveUninitialized: false
}))



//handlebars
app.set('views', `${__dirname}/views`);
const hbs = handlebars.create();
hbs.handlebars.registerHelper('set', function(name, value, options){
    options.data.root[name] = value;
});
hbs.handlebars.registerHelper('checkLastUser', function(value, options){
    if(options.data.root["lastUser"] != value){
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + "/public"));


//routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/chat", chatRouter);
app.use("/api/sessions", sessionsRouter);
app.use(viewsRouter);





