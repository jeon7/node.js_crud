var dataFolder = '../data';
var fs = require('fs');

fs.readdir(dataFolder, function(error, filelist){
    console.log(filelist);
});