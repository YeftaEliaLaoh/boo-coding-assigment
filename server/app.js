require('./models/Profile');
require('./models/Comment');

const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
    const mongoServer = new MongoMemoryServer();
    
    try {
        app.use(express.json());
        // set the view engine to ejs
        app.set('view engine', 'ejs');

        await mongoServer.start();

        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        //await mongoose.connect(`${mongoUri.slice(0, mongoUri.lastIndexOf('/'))}/${Database}`);
        console.log('Connected to MongoDB '+mongoUri);

        // routes
        app.use('/', require('./routes/profile')());
        app.use('/id', require('./routes/profile')());
        app.use('/register', require('./routes/profile')());
        app.use('/login', require('./routes/profile')());
        app.use('/update', require('./routes/profile')());
        app.use('/add', require('./routes/profile')());
        app.use('/comments', require('./routes/profile')());

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error starting MongoDB:', err);
        process.exit(1);
    }
}

startServer();
