const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.static('public/html'));
app.use(express.static('public/css'));
app.use(express.static('public/scripts'));

const bcrypt = require('bcrypt');
const fs = require('fs');

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
    fs.readFile("data/korisnici.json", 'utf-8', async (err, data) => {
        if (err) {
          console.error(`Error reading JSON file: ${err}`);
          return;
        }
        const jsonData = JSON.parse(data);
        const user = jsonData.find(user => user.username === username);

        req.session.username = user && (await bcrypt.compare(password, user.password)) ? username : null;

        if (req.session.username) {
            res.status(200).json({ "poruka": "Uspješna prijava" });
        } else {
            res.status(401).json({ "greska": "Neuspješna prijava" });
        }
      });
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


app.get("/korisnik", (req, res) => {
    if (req.session.username) {
        fs.readFile("data/korisnici.json", 'utf-8', async (err, data) => {
                if (err) {
                    console.error(`Error reading JSON file: ${err}`);
                    return;
                }
                const jsonData = JSON.parse(data);
                const user = jsonData.find(user => user.username === req.session.username);
                if (user) {
                    res.status(200).json({
                        id: user.id,
                        ime: user.ime,
                        prezime: user.prezime,
                        username: user.username,
                        password: user.password
                    });
                } else {
                    res.status(500).json({ "greska": "Internal Server Error" });
                }
            }
        )}
    else {
        res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
});


app.post("/upit", async (req, res) => {
    if (!req.session.username) {
        res.status(401).json({ "greska": "Neautorizovan pristup" });
        return;
    }

    const { nekretnina_id, tekst_upita } = req.body;

    fs.readFile("data/korisnici.json", 'utf-8', async (err, data) => {
        const korisniciJson = JSON.parse(data);
        const user = korisniciJson.find(u => u.username === req.session.username);

        if (!user) {
            res.status(500).json({ "greska": "Internal Server Error" });
            return;
        }

        fs.readFile("data/nekretnine.json", 'utf-8', async (err, data) =>{
            const nekretnineJson = JSON.parse(data);
            const nekretnina = nekretnineJson.find(n => n.id === nekretnina_id);

            if (!nekretnina) {
                res.status(400).json({ "greska": `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
                return;
            }

            if (!nekretnina.upiti) {
                nekretnina.upiti = [];
            }
            

            nekretnina.upiti.push({
                korisnik_id: user.id,
                tekst_upita
            });

            await fs.writeFile("data/nekretnine.json", JSON.stringify(nekretnineJson, null, 2), (err) => {
                if (err) throw err;
            });

            res.status(200).json({ "poruka": "Upit je uspješno dodan" });
        })
    })
});


app.put("/korisnik", async (req, res) => {
    if (!req.session.username) {
        res.status(401).json({ "greska": "Neautorizovan pristup" });
        return;
    }

    const { ime, prezime, username, password } = req.body;

        await fs.readFile("data/korisnici.json", 'utf-8', async (err, data) =>{
            let korisniciJson = JSON.parse(data);

            const userIndex = korisniciJson.findIndex(u => u.username === req.session.username);

            if (userIndex === -1) {
                res.status(500).json({ "greska": "Internal Server Error" });
                return;
            }

            korisniciJson[userIndex] = {
                ...korisniciJson[userIndex],
                ime: ime || korisniciJson[userIndex].ime,
                prezime: prezime || korisniciJson[userIndex].prezime,
                username: username || korisniciJson[userIndex].username,
                password: password ? await bcrypt.hash(password, 10) : korisniciJson[userIndex].password,
            };

            await fs.writeFile("data/korisnici.json", JSON.stringify(korisniciJson, null, 2), (err) => {
                if (err) throw err;
            });

            res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
        });
    
});


app.get("/nekretnine", async (req, res) => {
    fs.readFile("data/nekretnine.json", 'utf-8', (err, data) => {
        const nekretnineJson = JSON.parse(data);
        res.status(200).json(nekretnineJson);
    })
});

// dodatna ruta za dobavljanje svih korisnika
// potrebna u nekretnine.js da bi se ispravno pozvao modul SpisakNekretnina.js
app.get("/korisnici", async (req, res) => {
    fs.readFile("data/korisnici.json", 'utf-8', (err, data) => {
        const korisniciJson = JSON.parse(data);
        res.status(200).json(korisniciJson);
    })
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
  
    fs.readFile('data/nekretnineData.json', 'utf-8', (err, data) => {
      if (err) {
        console.error(`Error reading JSON file: ${err}`);
        return res.status(500).json({ "error": "Internal Server Error" });
      }
  
      let nekretnineData = JSON.parse(data);
  
      nizNekretnina.forEach(id => {
        const nekretnina = nekretnineData.find(item => item.id === id);
        if (nekretnina) {
          nekretnina.pretrage = (nekretnina.pretrage || 0) + 1;
        }
      });
  
      fs.writeFile('data/nekretnineData.json', JSON.stringify(nekretnineData, null, 2), 'utf-8', (err) => {
        if (err) {
          console.error(`Error writing JSON file: ${err}`);
          return res.status(500).json({ "error": "Internal Server Error" });
        }

        res.status(200).end();
      });
    });
  });

  app.post("/marketing/nekretnina/:id", (req, res) => {
    const nekretninaId = req.params.id;
  
    fs.readFile('data/nekretnineData.json', 'utf-8', (err, data) => {
      if (err) {
        console.error(`Error reading JSON file: ${err}`);
        return res.status(500).json({ "error": "Internal Server Error" });
      }
  
      let nekretnineData = JSON.parse(data);
  
      const nekretnina = nekretnineData.find(item => item.id === parseInt(nekretninaId));
  
      if (nekretnina) {
        nekretnina.klikovi = (nekretnina.klikovi || 0) + 1;
  
        fs.writeFile('data/nekretnineData.json', JSON.stringify(nekretnineData, null, 2), 'utf-8', (err) => {
          if (err) {
            console.error(`Error writing JSON file: ${err}`);
            return res.status(500).json({ "error": "Internal Server Error" });
          }
  
          res.status(200).end();
        });
      } else {
        res.status(404).json({ "error": "Nekretnina not found" });
      }
    });
  });

  app.post("/marketing/osvjezi", (req, res) => {
    if (req.session.previousNekretnineCall === null) {
    req.session.previousNekretnineCall = req.body.nizNekretnina;
    }
    const nekretnineIds = req.body.nizNekretnina || req.session.previousNekretnineCall;

    fs.readFile('data/nekretnineData.json', 'utf-8', (err, data) => {
      if (err) {
        console.error(`Error reading nekretnineData.json: ${err}`);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      const nekretnineData = JSON.parse(data);

      const previousNekretnineData = req.session.previousNekretnineData || [];

      const idsToUse = nekretnineIds || previousNekretnineData.map(item => item.id);

      const responseJson = idsToUse.map(id => {
        const nekretnina = nekretnineData.find(item => item.id === id);
        const previousNekretnina = previousNekretnineData.find(item => item.id === id);

        if (!previousNekretnineData.length || (previousNekretnina && (previousNekretnina.klikovi !== nekretnina.klikovi || previousNekretnina.pretrage !== nekretnina.pretrage))) {
          return {
            id,
            klikovi: nekretnina.klikovi,
            pretrage: nekretnina.pretrage
          };
        }
  
        return null; // No changes for this nekretnina
      }).filter(Boolean); // Remove null values from the array
  
      req.session.previousNekretnineData = nekretnineData;
      
      res.status(200).json({ nizNekretnina: responseJson });
    });
  });
  

app.listen(3000);