const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const habitablePlanets = [];

const isHabitiablePlanet = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', data => {
                if (isHabitiablePlanet(data))
                    habitablePlanets.push(data);
            })
            .on('error', error => {
                console.log(error);
                reject(error);
            })
            .on('end', () => {
                console.log(`The kepler telescope found ${habitablePlanets.length} planets that could be habitable`);
                resolve();
            });
    });
}

function getAllPlanets() {
    return habitablePlanets;
}


module.exports = {
    loadPlanetsData,
    getAllPlanets,
};