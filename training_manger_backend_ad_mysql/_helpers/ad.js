// check documentation https://www.npmjs.com/package/activedirectory2

var ActiveDirectory = require("activedirectory2"); //activedirectory
const config = require("config.json");

    
var ad = new ActiveDirectory(config.ad_config);

module.exports = ad;