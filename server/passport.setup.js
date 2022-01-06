// import { query } from './database.js';

const {query} = require('./database.js')

// import passport from 'passport';

const passport = require('passport'); 

const GoogleStrategy = require('passport-google-oidc')

// import GoogleStrategy from 'passport-google-oidc';

const dotenv = require('dotenv')

// import * as dotenv from 'dotenv'
dotenv.config()

// const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
//should we import query function that console logs/and then makes database query? 
const GOOGLE_CLIENT_ID = "916287185310-nevieskr9ikceprc43meutsaj4dat6b8.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.serializeUser((userID, done) => {
    done(null, userID);
});

passport.deserializeUser((userID, done) => {
    done(null, userID);
});

const passportObj = {};

passportObj.passportSetup = () =>  { 
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/google/callback'
    }, () => {console.log('exited the initial passport.use')},
    
    //callback functions are invoked after second invocation of authenticate after being redirected to auth/google/callback
    async (issuer, profile, done) => {
        console.log('Running passport verify function')

        //set all the variables that should be inside the user object from google oauth
        const googleID = profile.id;
        const name = profile.displayName;

        //getting the sqlID ready for
        let sqlID = 0;

        //find the userID in sql, if it exists, then store sqlID. It must wait for this query to complete
        await query(`SELECT * FROM user WHERE oauthkey='${String(googleID)}',`)
        .then((queryData) => {
            //crap out if too many users
            if(queryData.rows.length > 1) {
                console.log('Too many instances of same user');
            }
            //if found, done it
            else if (queryData.rows.length === 1) {
                console.log('Found instance of user');
                sqlID = queryData.rows[0]._id;
                //creates the user object to pass back to the session
                const user = {
                    "sqlID": sqlID,
                    "name": name,
                    "Google ID": googleID
                }

                done(null, user);
            }

            else{
                console.log(`Didn't find ${name}. Inserting into users table`);
                //if it doesn't exist, create new sql user with the name and google ID.
                query(`INSERT INTO user (name, oauthkey) VALUES ('${name}', '${String(googleID)}');`)
                .then(query => {
                    console.log(`Created user ${name}`);
                })
                .then(async () => {
                    await query(`SELECT * FROM user WHERE oauthkey='${String(googleID)}';`)
                    .then(query => {
                        sqlID = query.rows[0]._id;
                        const user = {
                            "sqlID": sqlID,
                            "name": name,
                            "Google ID": googleID
                        }
                        done(null, user);
                    })
                })
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
    }));
};

module.exports = passportObj;