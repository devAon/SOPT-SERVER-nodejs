## javascript seminar1 요약 및 총정리

1. 정의

* 객체기반 스크립트 언어
-> 거의 모든 것이 객체. (기본 data type, null, undefined 제외한 모든것. 즉, 함수도 객체)
-> 스크립트 언어란? (== 인터프리터 언어)
    코드 한줄씩 번역하여 코드에 문법 오류가 있으면 실행시점에서 발견됨. 보안 bad, 성능 good

* 웹브라우저 내에서 주로 사용

* 동적 바인딩, 동적 언어
-> 따라서, 변수의 타입 미리 선언할 필요x

* 모든 객체는 프로토타입(원형).
-> 클래스 없음. 상속x , 객체를 원형(프로토타입)으로 복제의 과정을 통하여 객체의 동작방식 사용가능


2. 문법
* 동적언어 => 변수 타입 미리 선언할 필요x (타입은 프로그램 처리 과정에서 자동으로 파악)

-type
* var : 변수 재선언 o   / Function scope
* let : 변수 재선언 x, 변수값 재할당 o  / Block scope
* const : 재선언 x, 재할당 x, 초기화 시 값을 대입하지 않으면 ERROR. /Block scope

```
1번 ) 
var v1 = 1;
var v1 = 2;

2번 ) 
let l1 = 1;
let l1 = 2;

3번 ) 
let l2;
l2 = 3;

4번 ) 
const c1;
c1 = 3; 
``` 

=> ERROR나는 부분은 몇번? 2, 4



-기초 자료형
* Boolean
* Null : typeof하면 Object. ===로만 확인 가능
* Undefined : 선언 ㅇ, 할당 x
* Number : 64bit 실수형. 정수형만 표현가능한 특별한 자료형 없음.
* String : immutable(한번 생성, 수정 x) , 백틱문자열 `My name is ${name}` 
* Symbol



-자료형
1. 배열

* (ex1)
```
var arr = new Array();
arr[0] = {
    "cafe" : "starbucks",
    "drink" : "coffee"
}
for(var x in arr){ 
    console.log(arr[x]);
    console.log(arr[x].cafe);
    console.log(arr[x].drink);
}
console.log(arr.length);

console.log("\n--------------------------------------------------\n");

arr.push({
    "store" : "맘스터치",
    "food" : "싸이버거"
})

for(var x in arr){ 
    console.log(arr[x]);
}
console.log(arr.length);

console.log("\n--------------------------------------------------\n");

console.log("arr.shift() : " + arr.shift()); // [object Object] 출력 && 삭제됨
for(var x in arr){ 
    console.log(arr[x]);
}
console.log(arr.length);
```

* (ex2)
```
var anything = [true, 24, 2.4, "Server", {name: "aon", age : 20}];

for(var i = 0; i < anything.length; i++){
    console.log(anything[i]);
}

for(var x in anything){ //x는 배열 index
    console.log(anything[x]);
}
```


* 배열 요소 삽입, 삭제
    * push 삽입
    * pop 맨 뒤 값 삭제
    * shift 맥 첫 값 삭제



2. 함수
* 함수 선언문
```
function hello(){
    console.log("hello");
}
hello();
```

* 함수 표현식
```
var a = function(){
    console.log("변수 a에 값 할당. 익명함수");
}
a();
```


* 화살표 함수 
Ex1)
```
var add = (x, y) => x + y;
console.log(add(10, 20));
```

Ex2)
```
var func1 = () => {
    for (key in arr) {
        for (key2 in arr[key]) {
            console.log(key2 + " : " + arr[key][key2]);
        }
    }
}
func1();
```


* JSON
```
var jsonEx = {
    "nickname" : "애오니",
    "hobby" : "Programming" //=> 희망사항
}
console.log(jsonEx);
```

* 객체요소 접근 방법1
```
console.log(jsonEx["nickname"]);
console.log(jsonEx["hobby"]);
```

* 객체요소 접근 방법2
```
console.log(jsonEx.nickname);
console.log(jsonEx.hobby);
```


* Json이란 ? JavaScript Object Notation. js에서 객체 만들 때 사용하는 표현식
* 경량의 데이터 교환. 특정언어에 종속x, 클라이언트와 데이터교환시 사용 :  aplication/json


* json 객체 값 접근
```
for(key in jsonEx){
    console.log(key + ", " + jsonEx[key]);
}
```

-연산자
```
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
```

-범위
* function scope : 모두 전역변수
* Block scope : 블록 if, while, for, function 등의 중괄호. 블록내에서만 유효.

```
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
```