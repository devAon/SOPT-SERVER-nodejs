const express = require('express');
const router = express.Router();
const csvManager = require('../../module/csvManager')


const filePath = './public/csvs/';


router.get('/', async (req, res) => {
    try {
        const groupArr = await csvManager.read('group.csv')
        console.log(groupArr);

        const groupMap = {};
        groupArr.forEach(element => {
            groupMap[element.groupIdx] = element.name;
        })
        //console.log(groupMap);

        const memberArr = await csvManager.read('member.csv');
        res.status(200).send(memberArr.map(it => `${it.name} : ${groupMap[it.groupIdx]}`).join(", "));

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }

})




router.get('/mixer', async (req, res) => {
    try {
        const memberArr = await csvManager.read('member.csv');
        var mixerArr = [...memberArr];
        mixerArr.forEach(element => {
            const mixIdx = parseInt(Math.random() * memberArr.length - 1);
            const tempGroupIdx = element.groupIdx;
            element.groupIdx = mixerArr[mixIdx].groupIdx;
            mixerArr[mixIdx].groupIdx = tempGroupIdx;
        });

        await csvManager.write('member.csv', mixerArr)
        res.status(200).send('success');
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }

})



router.get('/:groupIdx', async (req, res) => {
    const { groupIdx } = req.params;

    try {
        const memberArr = await csvManager.read('member.csv');
        res.status(200).send(memberArr
            .filter(it => it.groupIdx === groupIdx)
            .map(it => `${it.name}`)
            .join(', '));
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})


module.exports = router;
