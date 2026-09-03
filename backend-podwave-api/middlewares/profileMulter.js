const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/profiles'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = path.extname(file.originalname);
        cb(null, `profile-${req.user.id}-${uniqueSuffix}${extension}`);
    }
});

function fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Envie apenas arquivos de imagem.'));
    }
    cb(null, true);
}

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
