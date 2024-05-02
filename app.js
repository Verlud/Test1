const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const saltRounds = 10;
const app = express();
const port = 3000;

// Middleware pour parser le contenu des formulaires
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisation des sessions pour suivre les utilisateurs connectés
app.use(session({
  secret: 'votre_secret',
  resave: false,
  saveUninitialized: true
}));

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
  if (req.session.loggedin) {
    res.send('Bienvenue, ' + req.session.username + '!');
  } else {
    res.send('Veuillez vous connecter pour voir cette page!');
  }
});

// Route pour la page de connexion
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html'); // Assurez-vous que le fichier login.html existe
});

// Route pour traiter les données du formulaire de connexion
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query('SELECT * FROM utilisateurs WHERE nom = ?', [username], (err, results) => {
    if (err) {
      // Gérer l'erreur
      console.error('Erreur lors de la récupération de l\'utilisateur: ' + err.message);
      res.send('Erreur lors de la connexion.');
    } else if (results.length > 0) {
      bcrypt.compare(password, results[0].mot_de_passe, (err, result) => {
        if (result) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('/');
        } else {
          res.send('Mot de passe incorrect!');
        }
      });
    } else {
      res.send('Nom d\'utilisateur incorrect!');
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
