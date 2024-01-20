document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nekretnina_id = urlParams.get('id');

    PoziviAjax.getNekretninaById(nekretnina_id, function (error, data) {
        if (error) {
            console.error(`Error fetching nekretnina details: ${error}`);
            return;
        }

        updateDetails(data);
    });

    function updateDetails(data) {
        nekretnina = data.nekretnina
        upiti = data.upiti
        const osnovnoDiv = document.getElementById('osnovno');
        const detaljiDiv = document.getElementById('detalji');
        const upitiDiv = document.getElementById('upiti');

        osnovnoDiv.innerHTML = `
            <img src="https://www.aveliving.com/AVE/media/Property_Images/Florham%20Park/hero/flor-apt-kitchen-(1)-hero.jpg?ext=.jpg" alt="fotografija stana">
            <p><b>Naziv:</b> ${nekretnina.naziv}</p>
            <p><b>Kvadratura:</b> ${nekretnina.kvadratura} m2</p>
            <p class="price"><b>Cijena:</b> ${nekretnina.cijena} BAM</p>
        `;

        detaljiDiv.innerHTML = `
            <p><b>Tip grijanja:</b> ${nekretnina.tip_grijanja}</p>
            <p><b>Godina izgradnje:</b> ${nekretnina.godina_izgradnje}</p>
            <p><b>Lokacija:</b> ${nekretnina.lokacija}</p>
            <p><b>Datum objave:</b> ${nekretnina.datum_objave}</p>
            <p><b>Opis:</b> ${nekretnina.opis}</p>
        `;

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