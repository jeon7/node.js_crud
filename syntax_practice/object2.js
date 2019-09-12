var f = function() {
    console.log(1+1);
    console.log(1+2);
};

// f();
// console.log(f);

// var a = [f];
// a = 2;
// console.log(a);

var o = {
    func: f,
    name: 'a'
};

o.func();
console.log(o.name);