var fs = require('fs');

// //read file sync
// console.log('A');
// var result = fs.readFileSync('node_practice/sample.txt', 'utf8');
// console.log(result);
// console.log('C');

// read file async
console.log('A');
fs.readFile('node_practice/sample.txt', 'utf8', function(err, result){
    console.log(result);
    console.log(err);
});
console.log('C');
