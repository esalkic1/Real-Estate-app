const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt24","root","password",{host:"127.0.0.1",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.korisnik = require(__dirname + '/korisnik.js')(sequelize, Sequelize);
db.nekretnina = require(__dirname + '/nekretnina.js')(sequelize, Sequelize);
db.upit = require(__dirname + '/upit.js')(sequelize, Sequelize);

//relacije
// Veza 1-n vise upita jedan korisnik i vise upita jedna nekretnina
db.korisnik.hasMany(db.upit,{as:'upitiKorisnika'});
db.nekretnina.hasMany(db.upit, {as:'upitiNekretnine'})

module.exports=db;