const socket = io();

socket.emit('message', "bleh");


socket.on('deleteProduct', (data) => {
    console.log("removing object id: "+ data.id )
    const elementToRemove = document.getElementById(data.id);
    elementToRemove.remove();
});

socket.on('addProduct', (data) => {
    let p = data.product;
    if (p.thumbnails === undefined) p.thumbnails = [];
    let product = {id: data.id, title: p.title, pair: [{key: "Id", value: data.id}, ...Object.keys(p).map((obj, i) => {return {key: toTitleCase(obj), value:Object.values(p)[i]}})]};
    let htmlString = `<div id=${product.id}>
    <li><dt><b>${product.title}</b></dt></li>`;
    product.pair.forEach((x) => {
        htmlString += `<dd>${x.key}: ${x.value}</dd>`
    });
    htmlString += "</div>";
    const list = document.getElementById("toAdd");
    list.insertAdjacentHTML("beforeend", htmlString);
});

socket.on('updateProduct', (data) => {
    let p = data.product;
    let pairs = Object.keys(p).map((obj, i) => {return {key: toTitleCase(obj), value:Object.values(p)[i]}});
    const elementToReplace = document.getElementById(data.id);
    let htmlString = elementToReplace.innerHTML;
    if(p.title){
        htmlString = htmlString.replace(new RegExp(`<li><dt><b>.+<\/b><\/dt><\/li>`, "g"), `<li><dt><b>${p.title}</b></dt></li>`);
    }
    pairs.forEach(x => {
        htmlString = htmlString.replace(new RegExp(`<dd>${x.key}: .*<\/dd>`, "g"), `<dd>${x.key}: ${x.value}</dd>`);
    });
    elementToReplace.innerHTML = htmlString;
    
});


function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }