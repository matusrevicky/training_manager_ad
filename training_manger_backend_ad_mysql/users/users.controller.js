﻿const express = require('express');
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
router.get('/myEmployees/emp', authorize(), getMyDirectSubordinates);    // all authenticated users  getMyRole


module.exports = router;


// http://www.expertphp.in/article/user-login-and-registration-using-nodejs-and-mysql-with-example
async function authenticate(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  // autenticates (returns only true or false)
  ad.authenticate(username, password, async function (error, auth) {
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
      ad.find(query, async function (err, results) {
        if (err) {
          // console.log('ERROR: ' + JSON.stringify(error));
          return next(Error('Username or password is incorrect'));
        }
        if (!results) console.log('User: ' + username + ' not found.');
        else {

          /////////////// time to get role start //////////////////////////////////
          // notice nesting to get value from getRole
          var role = await getRole(results, async function (role) {

            
            ////////////// time to get role end ///////////////////////////////////////

            // determines if user is procurement - start
            results.users[0].role = await role;
            help = await config.procurement.find(function(element) {
              return element === results.users[0].extensionAttribute1;
            });
            
            if(help === undefined){
              results.users[0].procurement = 0;
            } else {
              results.users[0].procurement = 1;
            }
            //determines if user is procurement - end

            // console.log(results.users[0]);
            // sends user in specific format, required in frontend to store properly
            const token = jwt.sign({ sub: results.users[0] }, config.secret);
            const { ...userWithoutPassword } = results.users[0];
            return res.json({
              ...userWithoutPassword,
              token
            })

          });

        }
      });

    }
    else {
      // console.log('Authentication failed!');
      return next(Error('Something went wrong during authentication'));
    }
  });
}



async function getRole(input, output) {

  var query = "(&(objectClass=user)(objectCategory=person))";
  ad.find(query, async function (err, results) {
    if ((err) || (!results)) {
      // console.log('ERROR: ' + JSON.stringify(err));
      res.send(err);
    } else {
      const allUsers = await results.users;
      myManager = await allUsers.filter(allUsers => allUsers.dn === input.users[0].manager);

      console.log("SU to prensd " + myManager)
      if (myManager[0] === undefined) {
        output(3); // if There is no manager above me I am director
        return;
      }
      else {
        // finds my boss boss
        myManagerManager = await allUsers.filter(allUsers => allUsers.dn === myManager[0].manager);

        if (myManagerManager[0] === undefined) {
          output(2); // if There is 1 manager above me I am LM
          return;
        }
        else {
          myManagerManagerManager = await allUsers.filter(allUsers => allUsers.dn === myManagerManager[0].manager);

          if (myManagerManagerManager[0] === undefined) {
            output(1); // if There are 2 managers above me I am TL
            return;
          }

          else {
            myManagerManagerManagerManager = await allUsers.filter(allUsers => allUsers.dn === myManagerManagerManager[0].manager);

            if (myManagerManagerManagerManager[0] === undefined) {
              output(0); // if There are 3 managers above me I am normal user (no one below me)
              return;
            }
          }
        }
        output(15); // something went wrong 
      }
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

//check this https://forums.asp.net/t/1716111.aspx?query+AD+to+get+all+Employees+of+a+manager+
function getMyDirectSubordinates(req, res, next) {
  var dn = req.body.dn;

  var query = "(&(objectClass=user)(objectCategory=person)(manager=" + dn + "))";
  ad.find(query, function (err, results) {
    if ((err) || (!results)) {
      // console.log('ERROR: ' + JSON.stringify(err));
      res.send(err);
      return;
    } else {
      console.log(results.users);
      res.send(results.users);
    }
  });
}

/*
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
}*/

function getMyAllSubordinates(req, res, next) {
  var query = "(&(objectClass=user)(objectCategory=person)(manager=CN=Kondas Jaroslav,OU=DieboldUsers,DC=dn,DC=exmpl))";
  ad.find(query, function (err, results) {
    if ((err) || (!results)) {
      // console.log('ERROR: ' + JSON.stringify(err));
      res.send(err);
      return;
    } else {
      console.log(results.users);
      res.send(results.users);
    }
  });
}



