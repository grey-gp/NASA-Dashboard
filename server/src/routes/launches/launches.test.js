const request = require('supertest');

const app = require('../../app');

describe('Test GET /launches', () => {
    test('Testing launches get endpoint', async () => {
        request(app).get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});

describe('Test POST /launches', () => {

    const completeLaunchData = {
        mission: 'Fleet Down 123',
        rocket: 'Enterprise IS2',
        launchDate: 'June 12, 2030',
        target: 'Kepler-442 b'
    }

    const launchDataWithoutDate = {
        mission: 'Fleet Down 123',
        rocket: 'Enterprise IS2',
        target: 'Kepler-442 b'
    }

    const launchDataWithInvalidDate = {
        mission: 'Fleet Down 123',
        rocket: 'Enterprise IS2',
        launchDate: 'hello',
        target: 'Kepler-442 b'
    }

    test('Testing launches post endpoint with valid data', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('Testing launches post with missing data', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch information',
        });
    });

    test('Testing launches post with invalid date', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date',
        });
    });
});