var roles = {
    'programmer' : 'gk',
    'designer' : 'jk',
    'manager' : 'rm'
}

console.log(roles);

for(var name in roles) {
    console.log('object => ', name, ', value => ', roles[name]);
}

for(var key in roles) {
    console.log('object => ', key, ', value => ', roles[key]);
}

console.log(roles['designer']);