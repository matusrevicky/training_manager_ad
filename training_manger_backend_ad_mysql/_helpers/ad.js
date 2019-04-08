var ActiveDirectory = require("activedirectory2"); //activedirectory
const config = require('config.json');

var config2 = {
    url: config.url,
    baseDN: config.baseDN,
    username: config.username,
    password: config.password,
    Attr: {
        user: [//ak treba parameter, dopis sem (napr dopisal som 'manager')
          'dn', 'distinguishedName',
          'userPrincipalName', 'sAMAccountName', 'mail',
          'lockoutTime', 'whenCreated', 'pwdLastSet', 'userAccountControl',
          'employeeID', 'sn', 'givenName', 'initials', 'cn', 'displayName',
          'comment', 'description', 'manager'
        ],
        group: [
          'dn', 'cn', 'description', 'distinguishedName', 'objectCategory'
        ]
      },
    attributes: {
        user: [
        'dn', 'distinguishedName',
        'userPrincipalName', 'sAMAccountName', 'mail',
        'lockoutTime', 'whenCreated', 'pwdLastSet', 'userAccountControl',
        'employeeID', 'sn', 'givenName', 'initials', 'cn', 'displayName',
        'comment', 'description', 'manager'
        ],
        group: [
        'dn', 'cn', 'description', 'distinguishedName', 'objectCategory'
        ]
    }
};

var ad = new ActiveDirectory(config2);

module.exports = ad;