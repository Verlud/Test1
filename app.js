const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const port = 3000;

// Middleware pour parser le contenu des formulaires
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'Ludo.310',
  database: 'Test1'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données: ' + err.message);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil!');
});

// Route pour la page de connexion
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html'); // Assurez-vous que le fichier login.html existe
});

// Route pour la page d'inscription
app.get('/inscription', (req, res) => {
  res.sendFile(__dirname + '/inscription.html'); // Assurez-vous que le fichier inscription.html existe
});

// Route pour traiter les données du formulaire d'inscription
app.post('/inscription', (req, res) => {
  const nom = req.body.nom;
  const email = req.body.email;
  const mdp = req.body.mdp;

  // Hachage du mot de passe avec bcrypt
  bcrypt.hash(mdp, saltRounds, function(err, hash) {
    if (err) {
      console.error('Erreur lors du hachage du mot de passe: ' + err.message);
      res.send('Erreur lors de l\'inscription.');
    } else {
      const query = 'INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)';
      db.query(query, [nom, email, hash], (err, result) => {
        if (err) {
          console.error('Erreur lors de l\'insertion des données: ' + err.message);
          res.send('Erreur lors de l\'inscription.');
        } else {
          console.log('Inscription réussie avec l\'ID: ' + result.insertId);
          res.send('Inscription réussie pour ' + nom + ' avec l\'email ' + email);
        }
      });
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
