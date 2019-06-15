const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
    // Método de listagem de posts, a listagem será feita pelo mais recente
    async index(req, res) {
        // Usando o menos na frente, seria mesma coisa que o DESC no SQL
        const posts = await Post.find().sort('-createdAt');

        return res.json(posts);
    },

    // Método de criação de posts
    async store(req, res) {
        const { author, place, description, hashtags } = req.body;
        const { filename: image } = req.file;

        const [name] = image.split('.');
        const fileName = `${name}.jpg`;

        /**
         * Aqui eu faço o tratamento da foto para não pesar tanto no desktop, como no mobile
         */
        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            )
        
        // Quando criamos o post, a imagem vai para tanto a pasta resized como para a raiz
        // que é a upload, com o comando abaixo, deletamos a imagem "original" e deixamos apenas a tratada
        // na pasta resized, deixando ainda mais performático.
        fs.unlinkSync(req.file.path);

        const post = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: fileName,
        });

        req.io.emit('post', post);

        return res.json(post);
    }
};