const express = require('express');
const router = express.Router();

const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const db = require('_helpers/db');
const ad = require('_helpers/ad');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config.json');

// routes
router.post('/authenticate', authenticate);     // public route
router.get('/', authorize(), getAll); // admin only
router.get('/:id', authorize(), getById);       // all authenticated users
router.post('/register', register);
router.get('/substitute/:id', authorize(), getSubstitute);

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



// // https://social.technet.microsoft.com/wiki/contents/articles/5392.active-directory-ldap-syntax-filters.aspx
// zobrazuje aj neaktivnych
function getAll(req, res, next) {
    // var ad = new ActiveDirectory(config2);
     var groupName = config.groupName;//asi by nemalo byt na githube, citlivy udaj
 
     //vsetkych userov z group
     ad.getUsersForGroup(groupName, function (err, users) {
         if (err) {
             console.log('ERROR: ' + JSON.stringify(err));
             return;
         }
 
         if (!users) console.log('Group: ' + groupName + ' not found.');
         else {
             res.send(users);
         }
     }); 

}

function getById(req, res, next) {
    var id = parseInt(req.params.id);
    res.send(getById(id));
} 

function getById(employeeID){
    //var ad = new ActiveDirectory(config2);
    var query = 'employeeID='+employeeID;
    ad.findUsers(query, true, function(err, users) {
    if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }    
      if ((! users) || (users.length == 0)) console.log('No users found.');
      else {
          return users[0];
      }
    });
}

function getBysAMAccountName(sAMAccountName){
  //  var ad = new ActiveDirectory(config2);
    var query = 'sAMAccountName='+sAMAccountName;
    ad.findUsers(query, true, function(err, users) {
    if (err) {
        console.log('ERROR: ' +JSON.stringify(err));
        return;
      }    
      if ((! users) || (users.length == 0)) console.log('No users found.');
      else {
          return users[0];
      }
    });
}

function getMyDirectSubordinates(req, res, next){
    res.send(getMyDirectSubordinates());
}

function getMyDirectSubordinates(){
    //moji priamy podriadeny    

    var currentUser = getById(163004);
    //musime zistit kto je teraz prihlaseny, aby sme dostali jeho distinguishedName a hladali podla query 'manager='+user.distinguishedName;
    //nech je teraz prihlaseny akoze Waldhauser Peter, ktory ma id 163004
    
    query = 'manager='+currentUser.distinguishedName;
    //var ad = new ActiveDirectory(config2);
    ad.findUsers(query, true, function(err, users) {
        if (err) {
            console.log('ERROR: ' +JSON.stringify(err));
            return;
        }              
        if ((! users) || (users.length == 0)) console.log('No users found!');
        else {                                       
            return users;
        }
    });
}

function getMyAllSubordinates(req, res, next){
    res.send(getMyAllSubordinates);
}

function getMyAllSubordinates(){
    //vsetci moji podriadeny aj ich podriadeny...    

    var currentUser = getById(163004);
    //musime zistit kto je teraz prihlaseny, aby sme dostali jeho distinguishedName a hladali podla query 'manager='+user.distinguishedName;
    //nech je teraz prihlaseny akoze Waldhauser Peter, ktory ma id 163004
    
    console.log("TODO");//TODO
}



// este podla mysql
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