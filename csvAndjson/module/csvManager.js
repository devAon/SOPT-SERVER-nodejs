const csvtojson = require('csvtojson');
const path = require('path');
const json2csv = require('json2csv');
const fs = require('fs');

const filePath = './public/csvs/';


const csvManager = {
    //json -> csv
    write: (fileName, jsonArr) => {
        return new Promise((resolve, reject) => {
            const resultCsv = json2csv.parse(jsonArr);
            fs.writeFile(path.join(filePath, fileName), resultCsv, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    },
    read: (fileName) => {
        return new Promise((resolve, reject) => {
            csvtojson().fromFile(path.join(filePath, fileName)).then((jsonArr) => {
                resolve(jsonArr);
            }, (err) => {
                reject(err)
            })
        });
    }
}


module.exports = csvManager;