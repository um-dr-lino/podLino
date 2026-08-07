var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');
const { error: errorResponse } = require('./middlewares/apiResponse');

var indexRouter = require('./routes/index');

// Módulos da API
var userRoutes = require("./modules/user/userRoutes");
var videoRoutes = require("./modules/video/videoRoutes");
var likeRoutes = require("./modules/like/likeRoutes");
var commentRoutes = require("./modules/comment/commentRoutes");
var followRoutes = require("./modules/follow/followRoutes");
var followingVideosRoutes = require("./modules/follow/followingVideosRoutes");
var playlistRoutes = require("./modules/playlist/playlistRoutes");
var searchRoutes = require("./modules/search/searchRoutes");
var reportRoutes = require('./modules/report/reportRoutes');
var notificationRoutes = require('./modules/notification/notificationRoutes');
var adminRoutes = require('./modules/admin/adminRoutes');

var app = express();

// --- Middlewares globais ---
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS: permite que o front-end Vue (rodando em outra origem/porta) consuma a API.
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));


// Arquivos estáticos enviados por upload (vídeos, thumbnails, fotos de perfil)
// continuam servidos diretamente pelo Express, como URLs públicas.
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// --- Montagem das rotas da API ---
// Todas as rotas ficam sob o prefixo /api (ex: /api/login, /api/videos).
app.use(['/api', '/'], indexRouter);
app.use('/api', userRoutes);
app.use('/api', videoRoutes);
app.use('/api', likeRoutes);
app.use('/api', commentRoutes);
app.use('/api', followRoutes);
app.use('/api', followingVideosRoutes);
app.use('/api', playlistRoutes);
app.use('/api', searchRoutes);
app.use('/api', reportRoutes);
app.use('/api', notificationRoutes);
app.use('/api', adminRoutes);


// Captura qualquer rota não tratada pelos routers acima
app.use((req, res, next) => {
    return errorResponse(res, 'Rota não encontrada.', 404);
});

app.use(errorHandler);


//
// Configuração do Sequelize para conexão com o banco de dados MySQL
//
require("./config/associations");
const sequelize = require('./config/database');
sequelize.sync({ alter: true })
    .then(() => console.log('Banco de dados sincronizado!'))
    .catch(err => console.error('Erro ao sincronizar banco:', err));

module.exports = app;
