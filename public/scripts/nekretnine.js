function spojiNekretnine(divReferenca, instancaModula, kriteriji) {
    divReferenca.innerHTML = '';
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine(kriteriji);
    
    const nekretninaStil = document.createElement('div');
    switch(kriteriji.tip_nekretnine){
        case "Stan": 
        nekretninaStil.classList.add("stanovi");
        break;
        case "Kuća": 
        nekretninaStil.classList.add("kuce");
        break;
        case "Poslovni prostor":
        nekretninaStil.classList.add("poslovni-prostori");
        break;
    }

filtriraneNekretnine.forEach(nekretnina => {
    //console.log(nekretnina);
    const nekretninaDiv = document.createElement('div');
    nekretninaDiv.classList.add('nekretnina');
    nekretninaDiv.innerHTML = `
        <img src="https://www.aveliving.com/AVE/media/Property_Images/Florham%20Park/hero/flor-apt-kitchen-(1)-hero.jpg?ext=.jpg" alt="${nekretnina.naziv}">
        <p>${nekretnina.naziv}</p>
        <p>${nekretnina.kvadratura} m2</p>
        <p class="price">${nekretnina.cijena} BAM</p>
        <div id="pretrage-${nekretnina.id}">Broj pretraga: </div>
        <div id="klikovi-${nekretnina.id}">Broj klikova: </div>
        <div id="lokacija-${nekretnina.id}" style="display: none;">Lokacija: ${nekretnina.lokacija}</div>
        <div id="godina-${nekretnina.id}" style="display: none;">Godina izgradnje: ${nekretnina.godina_izgradnje}</div>
        <button class="detaljiBtn" id="detaljiBtn-${nekretnina.id}">Detalji</button>
        <button class="otvoriDetaljeBtn" id="otvoriDetaljeBtn-${nekretnina.id}" style="display: none;">Otvori detalje</button>
    `;

    const detaljiBtn = nekretninaDiv.querySelector(`#detaljiBtn-${nekretnina.id}`);
    const otvoriDetaljeBtn = nekretninaDiv.querySelector(`#otvoriDetaljeBtn-${nekretnina.id}`);

    detaljiBtn.addEventListener('click', function () {
        let allDivs = document.querySelectorAll(".nekretnina");
        const nekretninaId = this.id.split('-')[1];
        const idNekretnine = parseInt(nekretninaId, 10);
        MarketingAjax.klikNekretnina(idNekretnine);

        allDivs.forEach(item => {
            button = item.querySelector(".detaljiBtn");
            divId = button.id.split('-')[1]
            idDiv = parseInt(divId, 10);
            if(idDiv != idNekretnine){
                item.style.width = '270px';
                item.style.gridColumn = 'auto';
                item.style.justifySelf = 'auto';

                const lokacijaDiv = item.querySelector(`#lokacija-${idDiv}`);
                const godinaDiv = item.querySelector(`#godina-${idDiv}`);
                const otvoriDetaljeBtn = item.querySelector(`#otvoriDetaljeBtn-${idDiv}`);

                lokacijaDiv.style.display = 'none';
                godinaDiv.style.display = 'none';
                otvoriDetaljeBtn.style.display = 'none';
            }
        })

        const lokacijaDiv = nekretninaDiv.querySelector(`#lokacija-${nekretnina.id}`);
        const godinaDiv = nekretninaDiv.querySelector(`#godina-${nekretnina.id}`);

        lokacijaDiv.style.display = 'block';
        godinaDiv.style.display = 'block';

        otvoriDetaljeBtn.style.display = 'block';

        nekretninaDiv.style.width = '450px';
        nekretninaDiv.style.gridColumn = 'span 2';
        nekretninaDiv.style.justifySelf = 'center';
    });

    otvoriDetaljeBtn.addEventListener('click', function () {
        window.location.href = `detalji.html?id=${nekretnina.id}`; 
    });

    nekretninaStil.appendChild(nekretninaDiv);
});

    
    const h3Element = document.createElement('h3');
    h3Element.innerHTML = kriteriji.tip_nekretnine;
    divReferenca.appendChild(h3Element);
    if (filtriraneNekretnine.length > 0 && divReferenca) {
        divReferenca.appendChild(nekretninaStil);
    }
}



const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");


let listaNekretnina;
let nekretnine = SpisakNekretnina();
PoziviAjax.getNekretnine((error, data) => {
    if (error) {
        console.error(`Error: ${error}`);
    } else {
        listaNekretnina = data;
        PoziviAjax.getKorisnici((error, data) =>{
            if(error) {
                console.error(`Error: ${error}`)
            }
            else{
                listaKorisnika = data;
                nekretnine.init(listaNekretnina, listaKorisnika);
                spojiNekretnine(divStan, nekretnine, { tip_nekretnine: "Stan" });
                spojiNekretnine(divKuca, nekretnine, { tip_nekretnine: "Kuća" });
                spojiNekretnine(divPp, nekretnine, { tip_nekretnine: "Poslovni prostor" });
                MarketingAjax.novoFiltriranje(listaNekretnina)
            }
        })
    }
});

const divNekretnine = document.getElementById('nekretnine');
MarketingAjax.osvjeziPretrage(divNekretnine);
MarketingAjax.osvjeziKlikove(divNekretnine);

const filterBtn = document.getElementById('filterBtn');

    filterBtn.addEventListener('click', function () {

        const minPrice = parseFloat(document.getElementById('minPrice').value);
        const maxPrice = parseFloat(document.getElementById('maxPrice').value);
        const minArea = parseFloat(document.getElementById('minArea').value);
        const maxArea = parseFloat(document.getElementById('maxArea').value);
    
        const isValidNumber = (value) => !isNaN(value) && isFinite(value);
    
        const filterCriteriaStan = {
            tip_nekretnine: "Stan",
            ...(isValidNumber(minPrice) && { min_cijena: minPrice }),
            ...(isValidNumber(maxPrice) && { max_cijena: maxPrice }),
            ...(isValidNumber(minArea) && { min_kvadratura: minArea }),
            ...(isValidNumber(maxArea) && { max_kvadratura: maxArea }),
        };
    
        const filterCriteriaKuca = {
            tip_nekretnine: "Kuća",
            ...(isValidNumber(minPrice) && { min_cijena: minPrice }),
            ...(isValidNumber(maxPrice) && { max_cijena: maxPrice }),
            ...(isValidNumber(minArea) && { min_kvadratura: minArea }),
            ...(isValidNumber(maxArea) && { max_kvadratura: maxArea }),
        };
    
        const filterCriteriaPoslovniProstor = {
            tip_nekretnine: "Poslovni prostor",
            ...(isValidNumber(minPrice) && { min_cijena: minPrice }),
            ...(isValidNumber(maxPrice) && { max_cijena: maxPrice }),
            ...(isValidNumber(minArea) && { min_kvadratura: minArea }),
            ...(isValidNumber(maxArea) && { max_kvadratura: maxArea }),
        };
    
        spojiNekretnine(divStan, nekretnine, filterCriteriaStan);
        spojiNekretnine(divKuca, nekretnine, filterCriteriaKuca);
        spojiNekretnine(divPp, nekretnine, filterCriteriaPoslovniProstor);
    
        let filtriraneNekretnine = [];
        nekretnine.filtrirajNekretnine(filterCriteriaStan).forEach(item => filtriraneNekretnine.push(item));
        nekretnine.filtrirajNekretnine(filterCriteriaKuca).forEach(item => filtriraneNekretnine.push(item));
        nekretnine.filtrirajNekretnine(filterCriteriaPoslovniProstor).forEach(item => filtriraneNekretnine.push(item));
        MarketingAjax.novoFiltriranje(filtriraneNekretnine);
    });

    // za pravilno prikazivanje pri prvom pozivu
    document.addEventListener("DOMContentLoaded", function () {
        const divNekretnine = document.getElementById('nekretnine');
        MarketingAjax.osvjeziPretrage(divNekretnine);
        MarketingAjax.osvjeziKlikove(divNekretnine);
    });
