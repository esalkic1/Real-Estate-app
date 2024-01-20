const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.static('public/html'));
app.use(express.static('public/css'));
app.use(express.static('public/scripts'));

const bcrypt = require('bcrypt');
//const fs = require('fs');
const db = require('./db.js')

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const session = require("express-session");
app.use(session({
    secret: 'neka tajna sifra',
    resave: true,
    saveUninitialized: true
 }));


app.post("/login", async (req ,res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
      // Dobavljanje iz baze
      const user = await db.korisnik.findOne({
          where: {
              username: username
          }
      });

      req.session.username = user && (await bcrypt.compare(password, user.dataValues.password)) ? username : null;
      
      if (req.session.username) {
          res.status(200).json({ "poruka": "Uspješna prijava" });
      } else {
          res.status(401).json({ "greska": "Neuspješna prijava" });
      }
  } catch (error) {
      console.error(`Error querying the database: ${error}`);
      res.status(500).json({ "greska": "Interna greška" });
  }
})


app.post("/logout", (req, res) => {
    if (req.session.username) {
        req.session.destroy((err) => {
            if (err) {
                console.error(`Error destroying session: ${err}`);
                res.status(500).json({ "greska": "Internal Server Error" });
            } else {
                res.status(200).json({ "poruka": "Uspješno ste se odjavili" });
            }
        });
    } else {
        res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
});


app.get("/korisnik", async (req, res) => {
  if (req.session.username) {
      try {
          const user = await db.korisnik.findOne({
              where: { username: req.session.username }
          });

          if (user) {
              res.status(200).json({
                  id: user.dataValues.id,
                  ime: user.dataValues.ime,
                  prezime: user.dataValues.prezime,
                  username: user.dataValues.username,
                  password: user.dataValues.password
              });
          } else {
              res.status(500).json({ "greska": "Internal Server Error" });
          }
      } catch (error) {
          console.error(`Error querying the database: ${error}`);
          res.status(500).json({ "greska": "Internal Server Error" });
      }
  } else {
      res.status(401).json({ "greska": "Neautorizovan pristup" });
  }
});


app.post("/upit", async (req, res) => {
  try {
      if (!req.session.username) {
          return res.status(401).json({ "greska": "Neautorizovan pristup" });
      }

      const { nekretnina_id, tekst_upita } = req.body;

      // Dobavljanje korisnika iz baze
      const user = await db.korisnik.findOne({
          where: { username: req.session.username }
      });

      if (!user) {
          return res.status(500).json({ "greska": "Internal Server Error" });
      }

      // Dobavljanje nekretnine iz baze
      const nekretnina = await db.nekretnina.findOne({
          where: { id: nekretnina_id }
      });

      if (!nekretnina) {
          return res.status(400).json({ "greska": `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
      }

      if (!nekretnina.upiti) {
          nekretnina.upiti = [];
      }

      const upit = await db.upit.create({
          tekst_upita
      });

      nekretnina.addUpitiNekretnine(upit);
      user.addUpitiKorisnika(upit);

      res.status(200).json({ "poruka": "Upit je uspješno dodan" });
  } catch (error) {
      console.error(`Error handling upit: ${error}`);
      res.status(500).json({ "greska": "Internal Server Error" });
  }
});


app.put("/korisnik", async (req, res) => {
  try {
      if (!req.session.username) {
          return res.status(401).json({ "greska": "Neautorizovan pristup" });
      }

      const { ime, prezime, username, password } = req.body;

      // Dobavljanje korisnika iz baze
      const user = await db.korisnik.findOne({
          where: { username: req.session.username }
      });

      if (!user) {
          return res.status(500).json({ "greska": "Internal Server Error" });
      }

      const updatedData = {
          ime: ime || user.ime,
          prezime: prezime || user.prezime,
          username: username || user.username,
          password: password ? await bcrypt.hash(password, 10) : user.password,
      };

      await user.update(updatedData);

      res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
  } catch (error) {
      console.error(`Error updating user data: ${error}`);
      res.status(500).json({ "greska": "Internal Server Error" });
  }
});


app.get("/nekretnine", async (req, res) => {
  try {
      // Dobavljanje nekretnina iz baze
      const nekretnine = await db.nekretnina.findAll();

      res.status(200).json(nekretnine);
  } catch (error) {
      console.error(`Error fetching nekretnine data: ${error}`);
      res.status(500).json({ "greska": "Internal Server Error" });
  }
});

// dodatna ruta za dobavljanje svih korisnika
// potrebna u nekretnine.js da bi se ispravno pozvao modul SpisakNekretnina.js
app.get("/korisnici", async (req, res) => {
  try {
      // Assuming you have a Korisnik model in db
      const korisnici = await db.korisnik.findAll();

      res.status(200).json(korisnici);
  } catch (error) {
      console.error(`Error fetching korisnici data: ${error}`);
      res.status(500).json({ "greska": "Internal Server Error" });
  }
});
// dodatna ruta koja provjerava da li je korisnik logovan
// kako bi se izvrsio odgovarajuci prikaz menija
app.get("/status", (req, res) => {
    const isLoggedIn = !!req.session.username;
    res.json({ isLoggedIn });
});

// rute za 3. zadatak

  app.post("/marketing/nekretnine", async (req, res) => {
    const nizNekretnina = req.body.nizNekretnina;

    if (!Array.isArray(nizNekretnina) || nizNekretnina.length === 0) {
        return res.status(400).json({ "error": "Invalid or empty array of ids in the request body" });
    }

    try {
        // Dobavljanje nekretnina iz baze
        const nekretnine = await db.nekretnina.findAll({
            where: {
                id: nizNekretnina
            }
        });

        if (!nekretnine) {
            return res.status(404).json({ "error": "Nekretnine not found" });
        }

        // Update pretrage za svaku poslanu nekretninu
        nekretnine.forEach(async (nekretnina) => {
            await nekretnina.update({
                pretrage: (nekretnina.pretrage || 0) + 1
            });
        });

        res.status(200).end();
    } catch (error) {
        console.error(`Error updating nekretnine data: ${error}`);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

  app.post("/marketing/nekretnina/:id", async (req, res) => {
    const nekretninaId = req.params.id;

    try {
        // dobavljanje nekretnine iz baze
        const nekretnina = await db.nekretnina.findByPk(nekretninaId);

        if (!nekretnina) {
            return res.status(404).json({ "error": "Nekretnina not found" });
        }

        // Update klikova za nekretninu
        await nekretnina.update({
            klikovi: (nekretnina.klikovi || 0) + 1
        });

        res.status(200).end();
    } catch (error) {
        console.error(`Error updating nekretnina data: ${error}`);
        res.status(500).json({ "error": "Internal Server Error" });
    }
})
  
  app.post("/marketing/osvjezi", async (req, res) => {
    try {
      //console.log(req.session);
      // if(req.body.nizNekretnina.length != 0){
      //   req.session.previousNekretnineCall = req.body.nizNekretnina;
      // }
      if (Object.keys(req.body).length !== 0){
        req.session.previousNekretnineCall = req.body.nizNekretnina;
      }
        req.session.previousNekretnineCall = req.session.previousNekretnineCall || [];

        const nekretnineIds = req.body.nizNekretnina || req.session.previousNekretnineCall;

        // Dobavljanje iz baze
        const nekretnineData = await db.nekretnina.findAll({
            where: {
                id: {
                    [db.Sequelize.Op.in]: nekretnineIds
                }
            }
        });

        const previousNekretnineData = req.session.previousNekretnineData || [];

        const idsToUse = nekretnineIds || previousNekretnineData.map(item => item.id);

        const responseJson = idsToUse.map(id => {
            const nekretnina = nekretnineData.find(item => item.id === id);
            const previousNekretnina = previousNekretnineData.find(item => item.id === id);

            if (!previousNekretnineData.length || (previousNekretnina && (previousNekretnina.klikovi !== nekretnina?.dataValues.klikovi || previousNekretnina.pretrage !== nekretnina?.dataValues.pretrage))) {
                return {
                    id,
                    klikovi: nekretnina?.dataValues.klikovi,
                    pretrage: nekretnina?.dataValues.pretrage
                };
            }

            return null; // No changes for this nekretnina
        }).filter(Boolean); // Remove null values from the array

        req.session.previousNekretnineData = nekretnineData;
        req.session.previousNekretnineCall = nekretnineIds || [];

        res.status(200).json({ nizNekretnina: responseJson });
    } catch (error) {
        console.error(`Error updating nekretnine data: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// rute za spiralu 4

app.get("/nekretnina/:id", async (req, res) => {
  const nekretninaId = req.params.id;

  try {
      // Dobavljanje nekretnine iz baze
      const nekretnina = await db.nekretnina.findByPk(nekretninaId);

      if (nekretnina) {
          const upiti = await db.upit.findAll({
            where: { nekretninaId: nekretninaId },
          });
          const upitiWithUsernames = await Promise.all(upiti.map(async (upit) => {
            const korisnikData = await db.korisnik.findByPk(upit.KorisnikId, { attributes: ['username'] });
            return {
                tekst_upita: upit.tekst_upita,
                korisnikUsername: korisnikData ? korisnikData.username : null
            };
        }));
          const response = {
            nekretnina: nekretnina,
            upiti: upitiWithUsernames,
        };
          // Nekretnina postoji u bazi
          res.status(200).json(response);
      } else {
          // Nekretnina ne postoji u bazi
          res.status(400).json({ greska: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
      }
  } catch (error) {
      console.error(`Error retrieving nekretnina data: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
  

app.listen(3000);