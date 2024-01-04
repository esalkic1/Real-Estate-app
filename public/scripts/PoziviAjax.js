const PoziviAjax = (() => {
    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null
    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open("GET", "http://localhost:3000/korisnik", true);
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    const data = JSON.parse(ajax.responseText);
                    fnCallback(null, data);
                } else {
                    fnCallback(ajax.responseText, null)
                }
            }
        };
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }
    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback) {
    
        const ajax = new XMLHttpRequest();
        ajax.open("PUT", "http://localhost:3000/korisnik", true);
        ajax.setRequestHeader("Content-Type", "application/json");
    
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    const data = JSON.parse(ajax.responseText);
                    fnCallback(null, data);
                } else {
                    fnCallback(ajax.responseText, null);
                }
            }
        };
    
        ajax.send(JSON.stringify(noviPodaci));
    }
    // dodaje novi upit za trenutno loginovanog korisnika
    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        const ajax = new XMLHttpRequest();
        ajax.open("POST", "http://localhost:3000/upit", true);
        ajax.setRequestHeader("Content-Type", "application/json");

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    fnCallback(null, JSON.parse(ajax.responseText));
                } else {
                    fnCallback(ajax.responseText, null);
                }
            }
        };

        const data = JSON.stringify({ nekretnina_id, tekst_upita });
        ajax.send(data);
    }
    function impl_getNekretnine(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open("GET", "http://localhost:3000/nekretnine", true);
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    const data = JSON.parse(ajax.responseText);
                    fnCallback(null, data);
                } else {
                    fnCallback(ajax.responseText, null)
                }
            }
        };
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }
    function impl_postLogin(username, password, fnCallback) {
        const ajax = new XMLHttpRequest();
        ajax.open("POST", "http://localhost:3000/login", true);
        ajax.setRequestHeader("Content-Type", "application/json");

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    fnCallback(null, JSON.parse(ajax.responseText));
                } else {
                    fnCallback(ajax.responseText, null);
                }
            }
        };

        const data = JSON.stringify({ username, password });
        ajax.send(data);
    }
    function impl_postLogout(fnCallback) {
        const ajax = new XMLHttpRequest();
        ajax.open("POST", "http://localhost:3000/logout", true);
        ajax.setRequestHeader("Content-Type", "application/json");

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    fnCallback(null, JSON.parse(ajax.responseText));
                } else {
                    fnCallback(ajax.responseText, null);
                }
            }
        };
        ajax.send();
    }
    // dodatna funkcija, koristi se u nekretnine.js za poziv modula SpisakNekretnina.js
    function impl_getKorisnici(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open("GET", "http://localhost:3000/korisnici", true);
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    const data = JSON.parse(ajax.responseText);
                    fnCallback(null, data);
                } else {
                    fnCallback(ajax.responseText, null)
                }
            }
        };
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }
    // dodatna funkcija za provjeru statusa prijave kako bi se prikazao odgovarajuci meni
    function impl_getStatus(fnCallback){
        let ajax = new XMLHttpRequest();
        ajax.open("GET", "http://localhost:3000/status", true);
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    const data = JSON.parse(ajax.responseText);
                    fnCallback(null, data);
                } else {
                    fnCallback(ajax.responseText, null)
                }
            }
        };
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }
    return {
    postLogin: impl_postLogin,
    postLogout: impl_postLogout,
    getKorisnik: impl_getKorisnik,
    putKorisnik: impl_putKorisnik,
    postUpit: impl_postUpit,
    getNekretnine: impl_getNekretnine,
    getKorisnici: impl_getKorisnici, 
    getStatus: impl_getStatus
    };
    })();
    