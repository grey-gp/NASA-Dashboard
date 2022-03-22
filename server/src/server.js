const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const PORT = process.env.PORT || 8000;
const MONGO_URL = 'mongodb+srv://nasa-api:Ul5ChF3IPSErZI2q@nasacluster.beqv4.mongodb.net/nasa?retryWrites=true&w=majority';

const { loadPlanetsData } = require('./models/planets.model');

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('Connection to MongoDB established...');
});

mongoose.connection.on('error', err => {
    console.error(err);
});

async function startServer() {

    await mongoose.connect(MONGO_URL);

    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Listening at http://localhost:${PORT}`);
    });
}

startServer();