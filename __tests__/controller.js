const fs = require('fs');
const assert = require('assert');
const path = require('path');
const db = require('../server/database.js');
const controller = require('../server/controller.js');
const api = require('../server/api.js');
const request = require('supertest');
const server = 'http://localhost:3000';
const res = require('express/lib/response');
const req = require('express/lib/request');
const { post } = require('../server/api.js');

describe('database unit tests', (done) => {

    beforeAll((done) => {
        console.log("process.env.NODE_ENV", process.env.NODE_ENV);
        console.log("MY DATABASE IS BEST DATABASE", db.PG_URI );
        const queryString = 
            `CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
            DECLARE
                statements CURSOR FOR
                    SELECT tablename FROM pg_tables
                    WHERE tableowner = username AND schemaname = 'public';
            BEGIN
                FOR stmt IN statements LOOP
                    EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
                END LOOP;
            END;
            $$ LANGUAGE plpgsql;
            SELECT truncate_tables('gthdaqok');
            ;`;
        db.query(queryString);
        done();
    });

    afterAll((done) => {
        const queryString = 
            `SELECT truncate_tables('gthdaqok')
            ;`;
        db.query(queryString, done)
    });

    // afterAll((done) => {})

    const newUser = {
        name: 'dora',
        password: '123456'
    };

    describe("/api/signup/", () => {
        describe('POST', () => {
            it ('responds with 201 and name equal to the input, and hashed password not equal to the input', async () => { 
                await request (server)
                    .post('/api/signup/')
                    .send(newUser)
                    .expect(201)
                    .then((res) => {
                        console.log("POST res.body", res.body);
                        expect(res.body.name).toEqual(newUser.name);
                        expect(res.body.password).not.toEqual(newUser.password);
                        
                    })
                    ;

            })
        })
    });

    // This works reliably so far only when restarting test-server. But it works at other times too.
    describe("/api/users", () => {
        describe('GET', () => {
            it ('responds with 200 and newUser.name and hashed password', async () => {
                await request (server)
                    .get('/api/users/')
                    // .send(newUser)
                    .expect(200)
                    .then((res) => {
                        console.log("get /api/users/ res.body", res.body);
                        // console.log("newUser.name", newUser.name);
                        expect(res.body[0].name).toEqual(newUser.name);
                        expect(res.body[0].password).not.toEqual(newUser.password);
                    })
            }
            )
        })
    });

    const newEvent = {
        title: 'Big Bird terrorizes Sesame Street',
        street_name: 'W 63rd St., New York, NY 10023',
        video_url: 'https://www.youtube.com/watch?v=Ds0aDc6sBtg',
        image_url: 'https://live.staticflickr.com/154/362565006_7e309df0b1_b.jpg',
        details: 'You knew it was coming',
        // time: '12/31/2021 10:00:12 PM'
    };

    const { title, street_name, video_url, image_url, details } = newEvent;

    describe("/api/postevent/", () => {
        describe('POST', () => {
            it ('responds with 201 and the new event', async () => {
                await request(server)
                    .post('/api/postevent/')
                    .send(newEvent)
                    .expect(201)
                    .then((res) => {
                        expect(res.body).toHaveProperty('title', title);
                        expect(res.body).toHaveProperty('street_name', street_name);
                        expect(res.body).toHaveProperty('video_url', video_url);
                        expect(res.body).toHaveProperty('image_url', image_url);
                        expect(res.body).toHaveProperty('details', details);
                        // expect(res.body).toHaveProperty('time');
                        expect(typeof res.body.time).toBe('string');
                    })
                })
        })
    });

    describe("/api/incidents/", () => {
        describe('GET', () => {
            it ('responds with 200 and all events', async () => {
            await request(server)
                .get('/api/incidents')
                .expect(200)
                .then((res) => {
                    expect(res.body[0]).toHaveProperty('title', title);
                    expect(res.body[0]).toHaveProperty('street_name', street_name);
                    expect(res.body[0]).toHaveProperty('video_url', video_url);
                    expect(res.body[0]).toHaveProperty('image_url', image_url);
                    expect(res.body[0]).toHaveProperty('details', details);
                    // expect(res.body[0]).toHaveProperty('time');
                    expect(typeof res.body[0].time).toBe('string');
                })
            })
        })
    })

    describe("/api/incidents/user", () => {
        describe('POST', () => {
            it ('gets name and compares passwords throug bcrypt. Photo should be blank after signup.', async () => {
                await request(server)
                    .post('/api/incidents/user')
                    .send(newUser)
                    .expect(200)
                    .then((res) => {
                        expect(res.body.name).toEqual(newUser.name);
                        expect(res.body.photo).toBe(null);
                    })
            })
        })
    })

    // TODO: export schema of database and tables JUST in case
    // the database has multiple tables:
    // Figure out why get to/api/users fails sometimes when running multiple times. Does the test need to be changed or the dev code?
  
    // DELETE FROM user WHERE user_id > 2;
    // DELETE all tables after exporting schema.
    // reimport the schema.
    // This will be a better beforeAll and afterAll than the current version which truncates all rows from all tables.


        
});