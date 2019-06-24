const http = require('http');
const request = require('request');
const fs = require('fs');
const json2csv = require('json2csv');

const server = http.createServer((req, res) => {
    

    const option = {
        url: "http://15.164.75.18:3000/homework/2nd",
        method: "Get"
    }

    request(option, (err, response, body) => {

        console.log(body);
        const data = JSON.parse(body).data;
        console.log(data);


        const resultCsv = json2csv.parse({
            data : data,
            fields : ["time"]
        });


        fs.writeFile('info.csv', resultCsv, (err) =>{
            if (err) {
                data.msg = "파일 저장 에러";
                res.writeHead(500, { 'Content-Type': "text/plain" });
                res.write(JSON.stringify(data));
                res.end();
            } else {
                data.msg = "모두 다 성공!";
                res.writeHead(200, { 'Content-Type': "text/plain" });
                res.write(JSON.stringify(data));
                res.end();
            }
        });
        
    });
}).listen(3000,()=>{
    console.log("connect 3000 port!!");
});
