const http = require('http');
const request = require('request');
const querystring = require('querystring');
const crypto = require('crypto');
const url = require('url');
const fs = require('fs');
const json2csv = require('json2csv');
const csvtojson = require('csvtojson');

const server = http.createServer((req, res) => {
    const urlParsed = url.parse(req.url);
    const queryParsed = querystring.parse(urlParsed.query);
    if (urlParsed.pathname.toString() === '/signin/') {
        console.log(queryParsed);
        const pw = queryParsed.pw;
        crypto.randomBytes(64, (err, buf) => {
            if (err) {
                console.log('randombytes error');
                res.write('random bytes error');
                res.end();
            } //randombytes err 
            else {
                const salt = buf.toString('base64');
                console.log('salt : ' + salt);
                crypto.pbkdf2(pw, salt, 100000, 64, 'SHA512', (err, key) => {
                    if (err) {
                        console.log('pbkdf2 err');
                        res.write('pbkdf2 err');
                        res.end();
                    } 
                    else {
                        const hashedKey = key.toString('base64');
                        console.log('hashedKey : ' + hashedKey);
                        const userData = {
                            id: queryParsed.id,
                            pw: hashedKey,
                            salt: salt
                        }
                        const userDataToCsv = json2csv.parse({
                            data: userData,
                            fields: ['id', 'pw', 'salt']
                        })
                        fs.writeFile('userInfoCsv.csv', userDataToCsv, (err) => {
                            if (err) {
                                console.log('writeFile err');
                                res.write('writeFile err');
                                res.end();
                            }
                            else {
                                res.writeHead(200, { 'content-type': 'text/html; charset = utf-8' });
                                res.write('Sign-In Complete');
                                res.end();
                            }
                        })
                    }
                })
            }
        })
    }
    if (urlParsed.pathname.toString() === '/signup/') {
        const inputPw = queryParsed.pw;
        fs.readFile('./userInfoCsv.csv', (err, data) => {
            if (err) {
                console.log('readFile err');
                res.write('readFile err');
                res.end();
            }
            else {
                console.log(data.toString());
                csvtojson()
                    .fromFile('./userInfoCsv.csv')
                    .then((jsonData) => {
                        console.log(JSON.parse(jsonData[0].data).salt);
                        crypto.pbkdf2(inputPw, JSON.parse(jsonData[0].data).salt, 100000, 64, 'SHA512', (err, compareKey) => {
                            if (err) {
                                console.log('pbkdf2 err');
                                res.write('pbkdf2 err');
                                res.end();
                            }
                            else {
                                if (queryParsed.id === JSON.parse(jsonData[0].data).id 
                                        && compareKey.toString('base64') === JSON.parse(jsonData[0].data).pw.toString('base64')) {
                                    console.log('id amd pw correct');
                                    res.write('id and pw correct. login success!');
                                    res.end();
                                }
                                else {
                                    console.log('login fail');
                                    res.write('login fail. check your id or pw.');
                                    res.end();
                                }
                            }
                        })
                    })
            }
        })
    }
    if (urlParsed.pathname.toString() === '/info/') {
        const option = {
            url: 'http://15.164.75.18:3000/homework/2nd',
            method: 'POST',
            form: {
                name: '최예원',
                phone: '010-2791-1770'
            }
        };
        request(option, (err, Response, body) => {
            if (err) {
                console.log('request error');
            }
            else {
                console.log(body);
                console.log(JSON.parse(body).data);
                const myData = JSON.parse(body).data;
                crypto.randomBytes(64, (err, buf) => {
                    if (err) {
                        console.log('randomBytes err');
                        res.write('randomBytes err');
                        res.end();
                    }
                    else {
                        const salt = buf.toString('base64');
                        crypto.pbkdf2(myData.phone, salt, 100000, 64, 'SHA512', (err, hashedPhone) => {
                            if (err) {
                                console.log('pbkdf2 err');
                                res.write('pbkdf2 err');
                                res.end();
                            }
                            else {
                                myData.phone = hashedPhone.toString('base64');
                                const myDataCsv = json2csv.parse({
                                    myData: myData,
                                    fields: ['myData']
                                })


                                fs.writeFile('myData.csv', myDataCsv, (err) => {
                                    if (err) {
                                        console.log('writeFile err');
                                        res.write('writeFile err');
                                        res.end();
                                    }
                                    else {
                                        res.write('save complete');
                                        res.end();
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })


    }
}).listen(3000, () => {
    console.log('connect 3000');
}) 
