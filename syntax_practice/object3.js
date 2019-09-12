/**
 * problem 
 */ 
var v1 = 'v1';
// many code
v1 = 'gk';
var v2 = 'v2';



/**
 * reducing complexity with object  
 * */ 
var o = {
    var1: 'v1',
    var2: 'v2',
    func1: function () {
        console.log(this.var1);
    },
    func2: function () {
        console.log(this.var2);
    }
};

o.func1();
o.func2();


/**
 * can be problem later
 */ 
function f1() {
    console.log(o.var1);
}

function f2() {
    console.log(o.var2);
}

f1();
f2();