const express = require("express");
const router = express.Router();

router.get('/books', function (req, res, next) {
    let search_term = req.query.search;
    let minprice = req.query.minprice;
    let maxprice = req.query.maxprice;
    let sort = req.query.sort;

    let sqlquery = "SELECT * FROM books WHERE 1=1";
    let params = [];

    if (search_term) {
        sqlquery += " AND name LIKE ?";
        params.push('%' + search_term + '%');
    }
    if (minprice) {
        sqlquery += " AND price >= ?";
        params.push(minprice);
    }
    if (maxprice) {
        sqlquery += " AND price <= ?";
        params.push(maxprice);
    }
    if (sort) {
        const validSortColumns = ['name', 'price'];
        if (validSortColumns.includes(sort)) {
            sqlquery += " ORDER BY " + sort;
        }
    }

    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json(err);
            next(err);
        }
        else {
            res.json(result);
        }
    });
});


module.exports = router;