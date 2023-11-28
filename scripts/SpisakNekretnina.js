let SpisakNekretnina = function () {
    //privatni atributi modula
    let listaNekretnina = [];
    let listaKorisnika = [];


    //implementacija metoda
    let init = function (novaListaNekretnina, novaListaKorisnika) {
        listaNekretnina = novaListaNekretnina;
        listaKorisnika = novaListaKorisnika;
    }

    let filtrirajNekretnine = function (kriterij) {
        let filtriraneNekretnine = listaNekretnina;
        if("tip_nekretnine" in  kriterij){
            filtriraneNekretnine = filtriraneNekretnine.filter((nekretnina) => nekretnina.tip_nekretnine == kriterij["tip_nekretnine"])
        }
        if("min_kvadratura" in  kriterij){
            filtriraneNekretnine = filtriraneNekretnine.filter((nekretnina) => nekretnina.kvadratura >= kriterij["min_kvadratura"])
        }
        if("max_kvadratura" in  kriterij){
            filtriraneNekretnine = filtriraneNekretnine.filter((nekretnina) => nekretnina.kvadratura <= kriterij["max_kvadratura"])
        }
        if("min_cijena" in  kriterij){
            filtriraneNekretnine = filtriraneNekretnine.filter((nekretnina) => nekretnina.cijena >= kriterij["min_cijena"])
        }
        if("max_cijena" in  kriterij){
            filtriraneNekretnine = filtriraneNekretnine.filter((nekretnina) => nekretnina.cijena <= kriterij["max_cijena"])
        }

        return filtriraneNekretnine;
    }

    let ucitajDetaljeNekretnine = function (id) {
        const nekretnina = listaNekretnina.find(nekretnina => nekretnina.id === id);
        return nekretnina;
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};