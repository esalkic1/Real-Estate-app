document.getElementById("submitBtn").addEventListener("click", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const meniFrame = document.getElementById("meniFrame");
    const meniWindow = meniFrame.contentWindow;

    PoziviAjax.postLogin(username, password, (error, data) => {
        if (error) {
            console.error(`Error: ${error}`);
        } else {
            //console.log('Login Data:', data);
            meniWindow.updateMenu();
            window.location.href = "nekretnine.html";
        }
    });
});