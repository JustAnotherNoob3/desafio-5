let lastUser = document.getElementById('toAdd').lastElementChild ? document.getElementById('toAdd').lastElementChild.firstElementChild.textContent : null;
const socket = io();
let user;
let chatBox = document.getElementById('chatBox');
Swal.fire({
    title:"New Connection",
    input:"text",
    text:"Please enter a username to start chatting.",
    inputValidator:(value)=>{
        return !value && 'You need to use an username to chat.'
    },
    allowOutsideClick:false
}).then(result => {
    user = result.value;
});

chatBox.addEventListener('keydown', async evt => {
    if(evt.key === "Enter"){
        
        sendMessage()
        
    }
});

async function sendMessage(){
    if(!chatBox.value.trim().length>0) return;
    await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user: user, message: chatBox.value})
  });
    chatBox.value="";
}
async function updateMessage(id){
    
    if(!chatBox.value.trim().length>0) return;
    await fetch('/api/chat/'+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({content: chatBox.value})
  });
    chatBox.value="";
}
async function deleteMessage(id){
    await fetch('/api/chat/'+id, {
    method: 'DELETE'
  });
}
async function cleanChat(){
    await fetch('/api/chat/clean', {
    method: 'DELETE'
  });
}
socket.on("message_received", (data)=>{
    let m = data.message;
    if(!m.user) return;
    let htmlString = `<div id=${data.id} class="message">`
    if(m.user != lastUser) htmlString += `<dt><b>${m.user}:</b></dt>`;
    lastUser = m.user;
    htmlString += `<dd class="${m.user}">
    <li>${m.message} <input type="button" value="Edit" onclick="updateMessage('${data.id}')"><input type="button" value="Delete" onclick="deleteMessage('${data.id}')"></li>
</dd>`;
    htmlString += "</div>";
    const list = document.getElementById("toAdd");
    list.insertAdjacentHTML("beforeend", htmlString);
});
socket.on("message_updated", (data)=>{
    let update = document.getElementById(data.id).querySelector('dd');
    update.innerHTML = `<li>${data.message} <input type="button" value="Edit" onclick="updateMessage('${data.id}')"><input type="button" value="Delete" onclick="deleteMessage('${data.id}')"></li>`;
});
socket.on("message_deleted", (data)=>{
    let toDelete = document.getElementById(data.id);
    let user = (toDelete.firstElementChild.nodeName == "DT" && toDelete.nextElementSibling && toDelete.nextElementSibling.firstElementChild.nodeName == "DD") ? toDelete.nextElementSibling.firstElementChild.className : null;
    console.log(user)
    if(user){
        toDelete.nextElementSibling.insertAdjacentHTML("afterbegin", `<dt><b>${user}:</b></dt>`);
    }
    toDelete.remove();
});
socket.on("chat_cleansed", (data)=>{
    document.querySelectorAll('.message').forEach(e => e.remove());
});