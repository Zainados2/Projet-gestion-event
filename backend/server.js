const express = require('express');
const cors = require('cors');
const sequelize = require('../backend/models/db'); // Importer l'instance Sequelize
const helmet = require('helmet'); // Importer helmet
const articleRoutes = require('./routes/articleRoutes');
const decorRoutes = require('./routes/decorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const decor_articles = require('./routes/decor_articles');
const event_articles = require('./routes/event_articleRoutes');
const event_decors = require('./routes/event_decorsRoutes');

// Initialiser Express
const app = express();
const port = 8081;

// Configurer CORS
const corsOptions = {
  origin: [
    'http://localhost:3000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // Autoriser l'envoi de cookies, si nécessaire
};


app.use(cors(corsOptions));


app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "http://localhost:3000", "http://localhost:8080", "http://localhost:8081"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    connectSrc: ["'self'", "http://localhost:3000", "http://localhost:8080", "http://localhost:8081"],
    imgSrc: ["'self'", "data:", "http://localhost:8080", "http://localhost:8081"], 
  }
}));
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy()); 
app.use(helmet.dnsPrefetchControl({ allow: false })); 
app.use(helmet.permittedCrossDomainPolicies()); 
app.use(helmet.referrerPolicy({ policy: 'origin-when-cross-origin' }));



app.use(express.json());

// Configurer les routes
app.use('/articles', articleRoutes);
app.use('/decors', decorRoutes);
app.use('/events', eventRoutes);
app.use('/addresses', addressRoutes);
app.use('/decor_articles', decor_articles);
app.use('/event_articles', event_articles);
app.use('/event_decors', event_decors);
app.use('/', userRoutes);

// Synchroniser les modèles avec la base de données
const syncDatabase = async () => {
  try {
    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ alter: true }); // Utiliser `alter: true` pour mettre à jour la base de données sans perdre de données
    console.log('Modèles synchronisés avec la base de données.');
  } catch (error) {
    console.error('Erreur de synchronisation des modèles:', error);
    process.exit(1); // Arrêter le processus si la synchronisation échoue
  }
};

// Démarrer le serveur après la synchronisation des modèles
if (process.env.NODE_ENV !== 'test') {
  syncDatabase().then(() => {
    app.listen(port, () => {
      console.log(`Serveur backend en écoute sur le port ${port}`);
    });
  });
}

module.exports = app;
