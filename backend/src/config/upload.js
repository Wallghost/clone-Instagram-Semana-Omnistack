const multer = require('multer');
const path = require('path');

module.exports = {
    // Salvaremos as imagens localmente na pasta de upload
    storage: new multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    })
}