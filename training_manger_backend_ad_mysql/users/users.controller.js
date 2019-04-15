const express = require('express');
const router = express.Router();

const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const db = require('_helpers/db');
const ad = require('_helpers/ad');
const jwt = require('jsonwebtoken');
const config = require('config.json');
var _ = require('underscore');

// routes
router.post('/authenticate', authenticate);     // public route
router.get('/', authorize(), getAll);     // all authenticated users
router.get('/:id', authorize(), getByextensionAttribute1);    // all authenticated users

module.exports = router;


// http://www.expertphp.in/article/user-login-and-registration-using-nodejs-and-mysql-with-example
function authenticate(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  // autenticates (returns only true or false)
  ad.authenticate(username, password, function (error, auth) {
    if (error) {
      console.log('ERROR: ' + JSON.stringify(error));
      return next(Error('Username or password is incorrect'));
    }

    if (auth) {
      // console.log('Authenticated!');
      // if sucessfuly autenticated find user
      var name = username.match(/^([^@]*)@/)[1]; // the only way that works, gets name before @

      // sAMAccountName should be unique
      var query = "(&(objectCategory=person)(objectClass=user)(sAMAccountName=" + name + "))";

      //var ad = new ActiveDirectory(config);
      ad.find(query, function (err, results) {
        if (err) {
          // console.log('ERROR: ' + JSON.stringify(error));
          return next(Error('Username or password is incorrect'));
        }
        if (!results) console.log('User: ' + username + ' not found.');
        else {
          // console.log(results.users[0]);
          // sends user in specific format, required in frontend to store properly
          const token = jwt.sign({ sub: results.users[0] }, config.secret);
          const { ...userWithoutPassword } = results.users[0];
          return res.json({
            ...userWithoutPassword,
            token
          })
        }
      });

    }
    else {
      // console.log('Authentication failed!');
      return next(Error('Something went wrong during authentication'));
    }
  });
}



//  https://social.technet.microsoft.com/wiki/contents/articles/5392.active-directory-ldap-syntax-filters.aspx
// shows also disabled users
function getAll(req, res, next) {

  var groupName = config.groupName;
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

// it was requested that user should be identified by extensionAttribute1
function getByextensionAttribute1(req, res, next) {
  var extensionAttribute1 = parseInt(req.params.id);
  var query = "(&(objectCategory=person)(objectClass=user)(extensionAttribute1=" + extensionAttribute1 + "))";

  //var ad = new ActiveDirectory(config);
  ad.find(query, function (err, results) {
    if ((err) || (!results)) {
      // console.log('ERROR: ' + JSON.stringify(err));
      return;
    } else {
      console.log(results.users[0]);
      res.send(results.users[0]);
    }
  });
}

//var query = "(&(objectCategory=person)(objectClass=user)(directReports=*)(!(manager=*)))";
// https://social.technet.microsoft.com/wiki/contents/articles/5392.active-directory-ldap-syntax-filters.aspx
//var query = "(&(objectCategory=person)(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=2))";


//var sAMAccountName = 'john.smith@domain.com';
function getBysAMAccountName(sAMAccountName) {
  //  var ad = new ActiveDirectory(config2);
  var query = 'sAMAccountName=' + sAMAccountName;
  ad.findUsers(query, true, function (err, users) {
    if (err) {
      console.log('ERROR: ' + JSON.stringify(err));
      return;
    }
    if ((!users) || (users.length == 0)) console.log('No users found.');
    else {
      return users[0];
    }
  });
}

function getMyDirectSubordinates(req, res, next) {
  res.send(getMyDirectSubordinates());
}

function getMyDirectSubordinates() {
  //moji priamy podriadeny    

  var currentUser = getById(163004);
  //musime zistit kto je teraz prihlaseny, aby sme dostali jeho distinguishedName a hladali podla query 'manager='+user.distinguishedName;
  //nech je teraz prihlaseny akoze Waldhauser Peter, ktory ma id 163004

  query = 'manager=' + currentUser.distinguishedName;
  //var ad = new ActiveDirectory(config2);
  ad.findUsers(query, true, function (err, users) {
    if (err) {
      console.log('ERROR: ' + JSON.stringify(err));
      return;
    }
    if ((!users) || (users.length == 0)) console.log('No users found!');
    else {
      return users;
    }
  });
}

function getMyAllSubordinates(req, res, next) {
  res.send(getMyAllSubordinates);
}

function getMyAllSubordinates() {
  //vsetci moji podriadeny aj ich podriadeny...    

  var currentUser = getById(163004);
  //musime zistit kto je teraz prihlaseny, aby sme dostali jeho distinguishedName a hladali podla query 'manager='+user.distinguishedName;
  //nech je teraz prihlaseny akoze Waldhauser Peter, ktory ma id 163004

  console.log("TODO");//TODO
}



