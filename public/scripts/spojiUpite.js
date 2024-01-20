document.addEventListener('DOMContentLoaded', function () {
    const pageDiv = document.getElementById('page');

    const urlParams = new URLSearchParams(window.location.search);
    const nekretnina_id = urlParams.get('id');

    PoziviAjax.getStatus(function (error, data) {
        if (error) {
            console.error(`Error checking user status: ${error}`);
            return;
        }

        if (data && data.isLoggedIn) {
            const inputField = document.createElement('input');
            inputField.setAttribute('type', 'text');
            inputField.setAttribute('id', 'upitInput');
            inputField.setAttribute('class', 'upit-input'); 
            inputField.setAttribute('placeholder', 'Postavite upit');

            const confirmButton = document.createElement('button');
            confirmButton.setAttribute('id', 'confirmButton'); 
            confirmButton.textContent = 'Potvrdi';
            confirmButton.addEventListener('click', function () {
                const queryText = inputField.value;
        
                PoziviAjax.postUpit(nekretnina_id, queryText, function (error, data) {
                    if (error) {
                        console.error(`Error posting upit: ${error}`);
                        return;
                    }
        
                    PoziviAjax.getNekretninaById(nekretnina_id, function (error, data) {
                        if (error) {
                            console.error(`Error fetching nekretnina details: ${error}`);
                            return;
                        }
                        updateUpiti(data.upiti);
                    });
                });
        
                inputField.value = '';
            });
        
            pageDiv.appendChild(inputField);
            pageDiv.appendChild(confirmButton);
        } else {
            // Korisnik nije prijavljen
        }
    });

    function updateUpiti(upiti) {
        const upitiDiv = document.getElementById('upiti');
        upitiDiv.innerHTML = `
            <ul>
                ${upiti.map(upit => `
                    <li>
                        <p class="username">${upit.korisnikUsername}</p>
                        <p>${upit.tekst_upita}</p>
                    </li>
                `).join('')}
            </ul>
        `;
    }
});
