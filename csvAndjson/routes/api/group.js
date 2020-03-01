var express = require('express');
var router = express.Router();

const csvtojson = require('csvtojson');
const path = require('path');
const json2csv = require('json2csv');
const fs = require('fs');


const filePath = './routes/api/';
const groupMap = {};

router.get('/', async (req, res) => {
    try {
        csvtojson().fromFile(path.join(filePath, 'group.csv')).then((groupArr) => {
            //console.log(groupArr);


            groupArr.forEach(element => {
                groupMap[element.groupIdx] = element.name;
            })
            //console.log(groupMap);
        })


        csvtojson().fromFile(path.join(filePath, 'member.csv')).then((memberArr) => {
            //console.log(memberArr);
            res.status(200).send(memberArr.map(it => `${it.name} : ${groupMap[it.groupIdx]}`).join(", "));
        })
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }

})




router.get('/mixer', async (req, res) => {
    try {

        csvtojson().fromFile(path.join(filePath, 'member.csv')).then((memberArr) => {

            var mixerArr = [...memberArr];
            mixerArr.forEach(element => {
                const mixIdx = parseInt(Math.random() * memberArr.length - 1);

                const tempGroupIdx = element.groupIdx;
                element.groupIdx = mixerArr[mixIdx].groupIdx;
                mixerArr[mixIdx].groupIdx = tempGroupIdx;
            })


            const memberFilePath = './routes/api/member';
            const resultCsv = json2csv.parse(mixerArr);

            fs.writeFileSync(`${memberFilePath}.csv`, resultCsv, function (err) {
                if (err) {
                    console.log("err");
                    return;
                }
                res.status(200).send('success');
            });

        })
        res.status(200).send('success');

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }

})



router.get('/:groupIdx', async (req, res) => {
    const { groupIdx } = req.params;

    try {
        csvtojson().fromFile(path.join(filePath, 'member.csv')).then((memberArr) => {
            //console.log(memberArr);
            res.status(200).send(memberArr
                .filter(it => it.groupIdx === groupIdx)
                .map(it => `${it.name}`)
                .join(', '));
        })
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})


module.exports = router;
