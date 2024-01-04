function updateMenu() {
    PoziviAjax.getStatus((error, data) => {
        if (error) {
            console.error(`Error checking login status: ${error}`);
            return;
        }

        const isLoggedIn = data.isLoggedIn;

        const menuItems = document.querySelector('ul');
        if (!menuItems) {
            return;
        }
        menuItems.innerHTML = '';

        if (isLoggedIn) {
            // User is logged in
            const profileItem = document.createElement('li');
            profileItem.innerHTML = '<a href="profil.html" target="_top"><b>Profil</b></a>';
            menuItems.appendChild(profileItem);

            const nekretnineItem = document.createElement('li');
            nekretnineItem.innerHTML = '<a href="nekretnine.html" target="_top"><b>Nekretnine</b></a>';
            menuItems.appendChild(nekretnineItem);

            const detaljiItem = document.createElement('li');
            detaljiItem.innerHTML = '<a href="detalji.html" target="_top"><b>Detalji</b></a>';
            menuItems.appendChild(detaljiItem);

            const odjavaItem = document.createElement('li');
            const odjavaButton = document.createElement('button');
            odjavaButton.textContent = 'Odjava';
            odjavaButton.addEventListener('click', function () {
                PoziviAjax.postLogout((error, data) => {
                    if (error) {
                        console.error(`Error: ${error}`);
                    } else {
                        //console.log('Logout Data:', data);
                        updateMenu();
                        // da li treba redirect? 
                    }
                });
            });
            odjavaItem.appendChild(odjavaButton);
            menuItems.appendChild(odjavaItem);
        } else {
            // User is not logged in
            const nekretnineItem = document.createElement('li');
            nekretnineItem.innerHTML = '<a href="nekretnine.html" target="_top"><b>Nekretnine</b></a>';
            menuItems.appendChild(nekretnineItem);

            const detaljiItem = document.createElement('li');
            detaljiItem.innerHTML = '<a href="detalji.html" target="_top"><b>Detalji</b></a>';
            menuItems.appendChild(detaljiItem);

            const prijavaItem = document.createElement('li');
            prijavaItem.innerHTML = '<a href="prijava.html" target="_top"><b>Prijava</b></a>';
            menuItems.appendChild(prijavaItem);
        }
    });
}

// Call the function to update the menu when the page loads
document.addEventListener('DOMContentLoaded', updateMenu);
