
function socketServerController(socketServer){
    socketServer.on('connection',socket => {
        console.log("Cliente Conectado.");
        socket.on('message',data => {
            console.log(data);
        });
    })
    
}

export default socketServerController;