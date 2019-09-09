var arr = new Array();
console.log("1) arr.length : " + arr.length);

arr[0] = {
    todayMonth: 4,
    todayDay: 13,
    time: "1시 33분",
    location: "한양대 경영관 B103"
}
console.log("2) arr.length : " + arr.length);


var func1 = () => {
    for (key in arr) {
        for (key2 in arr[key]) {
            console.log(key2 + " : " + arr[key][key2]);
        }
    }
}
func1();
console.log("3) arr.length : " + arr.length);



var func2 = () => {
    arr = [5, 5, "5시 55분", "에버랜드"];
    for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}
func2();
console.log("4) arr.length : " + arr.length);



arr.length += 3;    //배열 크기 임의 조정 가능
console.log("5) arr.length : " + arr.length);

arr[arr.length - 1] = "최예원"; //가능


