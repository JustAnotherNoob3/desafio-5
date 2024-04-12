function sendToCart(id){
    console.log(id);
    Swal.fire({
        title:"Add to cart",
        input:"text",
        text:"Please enter the cart id.",
        inputValidator:(value)=>{
            return !value && 'Please enter an id.'
        },
        allowOutsideClick:false
    }).then(result => {
        fetch(`/api/carts/${result.value}/products/${id}`, {
            method: 'POST',
          }).then(async (data) => {
            if(data.status == 400){
                Swal.fire({
                    title:"Error",
                    text: (await data.json()).error,
                    allowOutsideClick:false
                })  
            } else{
                Swal.fire({
                    title:"Success!",
                    text: "Successfully added the product!",
                    allowOutsideClick:false
                })  
            }
          });
    });
}
function logout(){
    fetch("/api/sessions/logout", {
        method: "GET"
      }).then((res) => {
        if (res.status === 200) {
            window.location.replace("/");
          }
      })
}