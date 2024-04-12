const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  //hacer un fetch
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if(response.status == 400){
        Swal.fire({
            title:"Error",
            text: (await response.json()).error,
            allowOutsideClick:false
        })  
    }
    if (response.status === 200) {
      window.location.replace("/");
    }
  });
});