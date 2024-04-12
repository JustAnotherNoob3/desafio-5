const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    //hacer el fetch
    fetch("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (response) => {
            if (response.status == 400) {
                Swal.fire({
                    title: "Error",
                    text: (await response.json()).error,
                    allowOutsideClick: false
                })
            } else if(response.status == 201){
                Swal.fire({
                    title: "Success!",
                    text: "User successfully registered.",
                    allowOutsideClick: false
                }).then(() => {
                    window.location.replace("/");
                })
            }
        })
});