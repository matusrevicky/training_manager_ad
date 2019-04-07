const express = require('express');
const router = express.Router();

const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const db = require('_helpers/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config.json');

// routes
router.post('/authenticate', authenticate);     // public route
router.get('/', authorize(), getAll); // admin only
router.get('/:id', authorize(), getById);       // all authenticated users
router.post('/register', register);
router.get('/substitute/:id', authorize(),  getSubstitute);  

module.exports = router;



function register(req, res, next) {
    var sql = "INSERT INTO users ( username, password, firstName, lastName, email, idBoss) VALUES ?";
    var values = [[req.body.username, bcrypt.hashSync(req.body.password, 10), req.body.firstName, req.body.lastName, req.body.email, req.body.idBoss]];
    console.log(values);
    db.query(sql, [values], function (err, results) {

        if (err) {
            res.err
        }
        else {
            if (results.length > 0) {
                db.query(sql, [values], function (err, result) {

                    if (err) {
                        res.err
                    }
                    else {
                
            
                        res.json(result);
                    }
                });
            }
            

            res.json(result);
        }
    });
}


// http://www.expertphp.in/article/user-login-and-registration-using-nodejs-and-mysql-with-example
async function authenticate(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    db.query('SELECT u.idUser, u.username, u.firstname, u.lastname, u.email, u.password, u.idBoss, r.role FROM users u join user_has_role ur on (ur.idUser = u.idUser) join roles r on(r.idRole = ur.idRole) where u.username = ?;', [username], function (error, results, fields) {
        if (error) {
            return res.json({
                status: false,
                message: 'there are some error with query'
            })
        } else {
            if (results.length > 0) {

                if (bcrypt.compareSync(password, results[0].password)) {
                    const token = jwt.sign({ sub: results[0].id, role: results[0].role }, config.secret);
                    const { password, ...userWithoutPassword } = results[0];
                    return res.json({
                        ...userWithoutPassword,
                        token
                    })

                } else {
                    return res.json({
                        status: false,
                        message: "name and password does not match"
                    });
                }

            }
            else {
                return res.json({
                    status: false,
                    message: "name does not exits"
                });
            }
        }
    });
}


function getAll(req, res, next) {
    db.query('SELECT u.idUser, u.username, u.firstname, u.lastname, u.email, u.password, u.idBoss, r.role FROM users u join user_has_role ur on (ur.idUser = u.idUser) join roles r on(r.idRole = ur.idRole);  ', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}


function getById(req, res, next) {
    var id = parseInt(req.params.id);
    db.query('SELECT u.idUser, u.username, u.firstname, u.lastname, u.email, u.password, u.idBoss, r.role FROM users u join user_has_role ur on (ur.idUser = u.idUser) join roles r on(r.idRole = ur.idRole) where u.idUser = ?;', [id], function (error, results, fields) {
        if (!error)
            return res.send(results[0]);
        else
            console.log(error);
    })
}


function getSubstitute(req, res, next) {
    var id = parseInt(req.params.id);
    db.query('select idUser, idSubstitute from user_has_substitute where idSubstitute = ?;', [id], function (error, results, fields) {
        if (!error)
            return res.send(results);
        else
            console.log(error);
    })
}