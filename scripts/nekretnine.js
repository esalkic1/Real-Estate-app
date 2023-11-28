function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
    
    const nekretninaStil = document.createElement('div');
    switch(tip_nekretnine){
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
        const nekretninaDiv = document.createElement('div');
        nekretninaDiv.innerHTML = `
            <img src="https://www.aveliving.com/AVE/media/Property_Images/Florham%20Park/hero/flor-apt-kitchen-(1)-hero.jpg?ext=.jpg" alt="${nekretnina.naziv}">
            <p>${nekretnina.naziv}</p>
            <p>${nekretnina.kvadratura} m2</p>
            <p class="price">${nekretnina.cijena} BAM</p>
            <button>Detalji</button>
        `;

        nekretninaStil.appendChild(nekretninaDiv);;
    });

    if (filtriraneNekretnine.length > 0 && divReferenca) {
        divReferenca.appendChild(nekretninaStil);
    }
}



const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}, {
    id: 3,
    tip_nekretnine: "Stan",
    naziv: "Novi stan Sarajevo",
    kvadratura: 74,
    cijena: 366000,
    tip_grijanja: "plin",
    lokacija: "Centar",
    godina_izgradnje: 2020,
    datum_objave: "11.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
}, {
    id: 4,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 81,
    cijena: 422000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2022,
    datum_objave: "25.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 5,
    tip_nekretnine: "Kuća",
    naziv: "Nova kuća Sarajevo",
    kvadratura: 114,
    cijena: 510000,
    tip_grijanja: "plin",
    lokacija: "Novi Grad",
    godina_izgradnje: 2016,
    datum_objave: "21.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 6,
    tip_nekretnine: "Kuća",
    naziv: "Renovirana kuća Sarajevo",
    kvadratura: 96,
    cijena: 335000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2010,
    datum_objave: "11.11.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 7,
    tip_nekretnine: "Kuća",
    naziv: "Useljiva kuća Sarajevo",
    kvadratura: 104,
    cijena: 408000,
    tip_grijanja: "plin",
    lokacija: "Centar",
    godina_izgradnje: 2017,
    datum_objave: "26.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 8,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Veliki poslovni prostor",
    kvadratura: 200,
    cijena: 641000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2018,
    datum_objave: "17.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 9,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Srednji poslovni prostor",
    kvadratura: 90,
    cijena: 444000,
    tip_grijanja: "plin",
    lokacija: "Centar",
    godina_izgradnje: 2022,
    datum_objave: "03.11.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

//instanciranje modula
let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

//pozivanje funkcije
spojiNekretnine(divStan, nekretnine, "Stan");
spojiNekretnine(divKuca, nekretnine, "Kuća");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");