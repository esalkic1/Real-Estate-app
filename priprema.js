const db = require('./db.js')
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});
function inicializacija(){
    var korisnik1,korisnik2;
    var korisniciListaPromisea=[];
    var nekretnineListaPromisea=[];
    var upitiListaPromisea=[];
    return new Promise(function(resolve,reject){
    upitiListaPromisea.push(db.upit.create({tekst_upita: "Nullam eu pede mollis pretium."}));
    upitiListaPromisea.push(db.upit.create({tekst_upita: "Phasellus viverra nulla."}));
    upitiListaPromisea.push(db.upit.create({tekst_upita: "Integer tincidunt."}));
    // korisniciListaPromisea.push(db.korisnik.create({ime:'Neko', prezime:"Nekic", username:"username1", password:"2b$10$KWJ9NGuuVXNXyXD.jZDlke5qst1cmluElcwDpg3oRN7qUcqyAi5Ke"}));
    // korisniciListaPromisea.push(db.korisnik.create({ime: 'Neko2', prezime: 'Nekic2', username: 'username2', password: '$2b$10$OyN9jcArpGKgTB/IzUO/nu8GjuzYsuf0UDR19PCI8QQ8HNu2reJZ2'}));
    Promise.all(upitiListaPromisea).then(function(upiti){
        var upit1=upiti.filter(function(a){return a.tekst_upita==='Nullam eu pede mollis pretium.'})[0];
        var upit2=upiti.filter(function(a){return a.tekst_upita==='Phasellus viverra nulla.'})[0];
        var upit3=upiti.filter(function(a){return a.tekst_upita==="Integer tincidunt."})[0]

        korisniciListaPromisea.push( // password: hashPassworda1
            db.korisnik.create({ime:'Neko', prezime:"Nekic", username:"username1", password:"$2b$10$MgM1W588itn8OSFAjGUeXO.ka2Q/.EUxw1jpdFQfItwtpMeF8tOtq"}).then(function(k){
                k.setUpitiKorisnika([upit1]);
                return new Promise(function(resolve,reject){resolve(k);});
            })
        );
        korisniciListaPromisea.push( // password: hashPassworda2
            db.korisnik.create({ime: 'Neko2', prezime: 'Nekic2', username: 'username2', password: '$2b$10$7xUeybegXqCDgQVkrorDX.DpoSTB8Gy3P6VPLewqXVWNBQDgx18gm'}).then(function(k){
                k.setUpitiKorisnika([upit2, upit3]);
                return new Promise(function(resolve,reject){resolve(k);});
            })
        );
        Promise.all(korisniciListaPromisea).then(function(korisnici){
            nekretnineListaPromisea.push(
                db.nekretnina.create({
                    tip_nekretnine: "Stan",
                    naziv: "Useljiv stan Sarajevo",
                    kvadratura: 58,
                    cijena: 232000,
                    tip_grijanja: "plin",
                    lokacija: "Novo Sarajevo",
                    godina_izgradnje: 2019,
                    datum_objave: "01.10.2023.",
                    opis: "Sociis natoque penatibus.",
                    klikovi: 70,
                    pretrage: 364
                }).then(function(n){
                    return n.setUpitiNekretnine([upit1, upit2]).then(function(){
                    return new Promise(function(resolve,reject){resolve(n);});
                    });
                })
            );
            nekretnineListaPromisea.push(
                db.nekretnina.create({
                    tip_nekretnine: "Poslovni prostor",
                    naziv: "Mali poslovni prostor",
                    kvadratura: 20,
                    cijena: 70000,
                    tip_grijanja: "struja",
                    lokacija: "Centar",
                    godina_izgradnje: 2005,
                    datum_objave: "20.08.2023.",
                    opis: "Magnis dis parturient montes.",
                    klikovi: 22,
                    pretrage: 363
                }).then(function(n){
                    return n.setUpitiNekretnine([upit3]).then(function(){
                    return new Promise(function(resolve,reject){resolve(n);});
                    });
                })
            );
            Promise.all(nekretnineListaPromisea).then(function(n){resolve(n);}).catch(function(err){console.log("Nekretnine greska "+err);});
        }).catch(function(err){console.log("Korisnici greska "+err);});
    }).catch(function(err){console.log("Upiti greska "+err);});   
    });
}
