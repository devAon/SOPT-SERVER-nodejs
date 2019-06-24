const http = require('http');
const url = require('url');
const querystring = require('querystring');
const crypto = require('crypto2');

const server = http.createServer((request,response)=>{ 
    const urlParsed = url.parse(request.url);
    console.log(urlParsed);
    const queryParsed = querystring.parse(urlParsed.query);
    //console.log(queryParsed);
    const str = queryParsed.str;
    console.log(str);
    crypto.randomBytes(32, (err, buf) => {
        if(err){
            console.log(err);
        }
        else{
            const salt = buf.toString('base64');
            
            console.log(`salt : ${salt}`);
            //console.log(slat);
            crypto.pbkdf2(str, salt, 10 ,32, 'SHA512',(err, result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    const hashedStr = result.toString('base64');
                    // console.log(hashedStr);
                    console.log(`hashedStr : ${hashedStr}`);
                    response.writeHead(200, {'Content-Type' : 'application/json'});
                    response.write(hashedStr);
                    response.end();
                }

            });
        }
    });
   // console.log(request);
}).listen(3000,()=>{
    console.log("server open!!");
});
