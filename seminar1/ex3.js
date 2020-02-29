//# type

//1번 ) 
var v1 = 1;
var v1 = 2;

console.log(v1);

//2번 ) 
let l1 = 1;
let l1 = 2;

console.log(l1);

//3번 ) 
let l2;
l2 = 3;

console.log(l2);

//4번 ) 
const c1;
c1 = 3;

console.log(c1);





//# 배열
//(ex1)
var arr = new Array();

arr1 = [true, 1, "String"];
arr[0] = {
    "cafe" : "starbucks",
    "drink" : "coffee",
}

arr[0] = arr1
for(var x in arr){ 
    console.log(arr[x]);
    console.log(arr[x].cafe);
    console.log(arr[x].drink);
}
console.log(arr.length);       //1



console.log("\n--------------------------------------------------\n");



arr.push({
    "store" : "momsTouch",
    "food" : "싸이버거"
})


for(var x in arr){ 
    console.log(arr[x]);    
}
console.log(arr.length);

arr.length++;

console.log(arr.length);


console.log("\n--------------------------------------------------\n");


console.log("arr.shift() : " + arr.shift()); // [object Object] 출력 && 삭제됨


for(var x in arr){ 
    console.log(arr[x]);
}
console.log(arr.length);



//(ex2)
var anything = [true, 24, 2.4, "Server", {name: "aon", age : 20}];

for(var i = 0; i < anything.length; i++){
    console.log(anything[i]);
}

for(var x in anything){ //x는 배열 index
    console.log(anything[x]);
}

//배열 요소 삽입, 삭제
// push 삽입
// pop 맨 뒤 값 삭제
// shift 맥 첫 값 삭제




//# 함수
//함수 선언문
function hello(){
    console.log("hello");
}
hello();

//함수 표현식
var a = function(){
    console.log("변수 a에 값 할당. 익명함수");
}
a();


//화살표 함수 
//Ex1)
var add = (x, y) => x + y;
console.log(add(10, 20));




//JSON

var jsonEx = {
    "nickname" : "애오니",
    "hobby" : "Programming"
}

console.log(jsonEx);

//객체요소 접근 방법1
console.log(jsonEx["nickname"]);
console.log(jsonEx["hobby"]);

//객체요소 접근 방법2
console.log(jsonEx.nickname);
console.log(jsonEx.hobby);


console.log("Json이란 ? JavaScript Object Notation. js에서 객체 만들 때 사용하는 표현식");
console.log("경량의 데이터 교환. 특정언어에 종속x, 클라이언트와 데이터교환시 사용 :  aplication/json ");

//json 객체 값 접근
for(key in jsonEx){
    console.log(key + ", " + jsonEx[key]);
}


var s1 = "난 String";
var s2 = "너도? 야나도 String";

var s3 = "1";
var n = 1;
var arr = [1, "number", true];
var arr2 = [2, "number2", false];

console.log(typeof(s1));
console.log(typeof(s2));
console.log(typeof(arr));
console.log(typeof(n));




//범위
//function scope : 모두 전역변수
//Block scope : 블록 if, while, for, function 등의 중괄호. 블록내에서만 유효.

function funcScopeTest() {
    var v1 = 0;

    if(true){
        var v2 = 0;
        for(var v3 = 0; v3 < 5; v3++){
            console.log("v3 = " + v3);
        }
        console.log("v2 = " + v2);
    }
}
funcScopeTest();
//console.log("v1 = " + v1);   //error






