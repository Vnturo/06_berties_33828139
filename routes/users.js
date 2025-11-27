// Create a new router
const { check, validationResult } = require('express-validator');
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('../users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered',
    [check('username').isLength({ min: 5, max: 20}).isAlphanumeric(),
     check('first').notEmpty().isAlpha(),
     check('last').notEmpty().isAlpha(),
     check('email').isEmail(), 
     check('password').isLength({ min: 8 })], 
    function (req, res, next) {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        res.render('register.ejs', { errors: errors.array() }); 
    }
    else {
        const first = req.sanitize(req.body.first)
        const last = req.sanitize(req.body.last)
        const email = req.sanitize(req.body.email)
        const username = req.sanitize(req.body.username)
        
        const saltRounds = 10
        const plainPassword = req.body.password

        // Hashing the password
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            if (err) {
                return next(err)
            }

            // Store hashed password in your database
            let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)"
            
            let newrecord = [username, first, last, email, hashedPassword]

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    next(err)
                }
                else {
                    res.render('registered.ejs', {
                        first: first,
                        last: last,
                        email: email,
                        password: req.body.password,
                        hashedPassword: hashedPassword
                    });
                }
            })
        })
    }
});

router.get('/list', redirectLogin, function (req, res, next) {
    // Query database to get all the users
    let sqlquery = "SELECT * FROM users"; 

    // Execute SQL query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        // Render the new listusers.ejs file and pass the data to it
        res.render("listusers.ejs", { availableUsers: result });
     });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
});
router.post('/loggedin',
    [check('username').notEmpty(),
     check('password').notEmpty()],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login.ejs', { error: 'Username and password are required.' });
    }
    
    const username = req.sanitize(req.body.username)
    const plainPassword = req.body.password

    let sqlquery = "SELECT * FROM users WHERE username = ?"
    db.query(sqlquery, [username], (err, results) => {
        if (err) {
            return next(err)
        }
        
        // This is a generic failure response
        if (results.length === 0) {
            return res.render('login.ejs', { error: 'Invalid username or password' });
        }
        
        const hashedPassword = results[0].hashedPassword
        bcrypt.compare(plainPassword, hashedPassword, function(err, compareResult) {
            
            if (compareResult == true) {
                req.session.userId = username; 
                let auditQuery = "INSERT INTO audit_log (username, action) VALUES (?, 'SUCCESSFUL_LOGIN')";
                db.query(auditQuery, [username], (auditErr, auditRes) => {
                    res.render('loggedin.ejs', { user: results[0] }); 
                });
            } else {
                let auditQuery = "INSERT INTO audit_log (username, action) VALUES (?, 'FAILED_LOGIN')";
                db.query(auditQuery, [username], (auditErr, auditRes) => {
                    res.render('login.ejs', { error: 'Invalid username or password' });
                });
            }
        });
    });
});

router.get('/audit', redirectLogin, function (req, res, next) {
let sqlquery = "SELECT username, action, timestamp FROM audit_log ORDER BY timestamp DESC"
    db.query(sqlquery, (err, result) => {    
    if (err) {
            next(err);
        }
        res.render("audit.ejs", { auditLogs: result });
        });
});


// Export the router object so index.js can access it
module.exports = router
