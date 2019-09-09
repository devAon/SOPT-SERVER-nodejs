console.log(5/2);

console.log(7 + 18 + "원");
console.log("원" + 7 + 18);

var num = 1;
var str = "1";

console.log(typeof(num));
console.log(typeof(str));


if(num == str){
    console.log("동치 연산자 true");
}else{
    console.log("동치 연산자 false");
}

if(num === str){
    console.log("일치 연산자 true");
}else{
    console.log("일치 연산자 false");
}

function funcScope(){
    var v1 = 0;
    if(true){
        var v2 = 0;
        for(var v3 = 0; v3 < 5; v3++);
        console.log("v3 = " + v3);
    }
    console.log("v2 = " + v2);

}
funcScope();
console.log("v1 = " + v1);

var v2 = "v2";

function funcTest3(){
    let l2 = "12";
    console.log(v2);
    console.log(l2);
}
funcTest3();

if(true){
    const c2 = "c2";
    console.log(c2);
}

console.log(v2);
console.log(l2);
//console.log(c2);




//자신의 이름 나이 학과 과 전화번호 생일 날짜와 일을 가진 json객체를 만들고 
//출력하는 함수를 화살표함수로 만들기
//백틱문자사용해서 제 생일은 몇월 몇일입니다. 
//문자 배열을 선언하고 나의 생일 달과 맞으면 출력하는 함수 선언. 함수 선언식.

var me = {
    name: "최예원",
    age: 23,
    college: "동덕여자대학교",
    major: "컴퓨터학과",
    tel: "010-2791-1770",
    birthMon: '4',
    birthDay: '2'
}

var fun1 = () => {
    for (key in me) {
        console.log(key + ", " + me[key]);
    }
}
fun1();
console.log(`제 생일은 ${me.birthMon}월 ${me.birthDay}일 입니다`);

