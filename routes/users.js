// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const saltRounds = 10
    const plainPassword = req.body.password;

        // Hashing the password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err)
        }

        // Store hashed password in your database
        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)"
        
        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword]

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else {
                let resultMsg = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
                resultMsg += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                
                res.send(resultMsg)
            }
        })
    })
}); 

router.get('/list', function (req, res, next) {
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
router.post('/loggedin', function (req, res, next) {
    const username = req.body.username
    const plainPassword = req.body.password
    let sqlquery = "SELECT * FROM users WHERE username = ?"
    db.query(sqlquery, [username], (err, results) => {
        if (err) {
            return next(err)
        }
        if (results.length === 0) {
            return res.send('User not found')
        }
        const hashedPassword = results[0].hashedPassword
        bcrypt.compare(plainPassword, hashedPassword, function(err, compareResult) {
            
            if (compareResult == true) {
                // Insert audit log entry
                let auditQuery = "INSERT INTO audit_log (username, action) VALUES (?, 'SUCCESSFUL_LOGIN')";
                db.query(auditQuery, [username], (auditErr, auditRes) => {
                    // Log the success message after audit log is inserted
                    res.send("Login successful! Welcome " + results[0].first_name); 
                });
            } else {
                // Insert audit log entry
                let auditQuery = "INSERT INTO audit_log (username, action) VALUES (?, 'FAILED_LOGIN')";
                db.query(auditQuery, [username], (auditErr, auditRes) => {
                    // Log the failure message after audit log is inserted
                    res.send("Login failed: Incorrect password.");
                });
            }
        });
    });
});

router.get('/audit', function (req, res, next) {
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