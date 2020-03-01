const groupMixer = {
    mix : (memberArr)=>{
        var mixerArr = [...memberArr];
        mixerArr.forEach(element => {
            const mixIdx = parseInt(Math.random() * memberArr.length - 1);
            const tempGroupIdx = element.groupIdx;
            element.groupIdx = mixerArr[mixIdx].groupIdx;
            mixerArr[mixIdx].groupIdx = tempGroupIdx;
        });

        return mixerArr;
    }
};

module.exports = groupMixer