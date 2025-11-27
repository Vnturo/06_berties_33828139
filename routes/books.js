// Create a new router
const { check, validationResult } = require('express-validator');
const express = require("express")
const router = express.Router()
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('../users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
router.get('/search', redirectLogin, function(req, res, next){
    res.render("search.ejs")
});

// Handle the search request
router.get('/search-result', redirectLogin,
    [check('keyword').notEmpty().isLength({ max: 50 })],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('./search'); 
    }
    let keyword = req.sanitize(req.query.keyword);

    // Change the SQL to use 'LIKE' instead of '='
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

    let search_term = '%' + keyword + '%';

    // Execute the query, passing in the NEW search_term
    db.query(sqlquery, [search_term], (err, result) => {
        if (err) {
            next(err);
        }
        
        // This part stays the same
        res.render("search-result.ejs", { availableBooks: result, keyword: keyword });
     });
});

router.get('/list', redirectLogin, function(req, res, next) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("list.ejs", {availableBooks:result})
         });
    });

// Add a new book - display the form
router.get('/addbook', redirectLogin, function (req, res, next) {
    res.render("addbook.ejs")
});

router.post('/bookadded', redirectLogin, 
    [check('name').notEmpty(),
     check('price').isFloat({ min: 0 })
    ],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('addbook.ejs', { errors: errors.array() });
        return;
    }
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.render('bookadded.ejs', { bookName: req.body.name });
    })
});

router.get('/bargainbooks', redirectLogin, function(req, res, next) {
    // This SQL query is the only part that's really different!
    let sqlquery = "SELECT * FROM books WHERE price < 20"; 

    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        // We will create a new EJS file to show these results
        res.render("bargainbooks.ejs", { availableBooks: result });
     });
});

// Export the router object so index.js can access it
module.exports = router
