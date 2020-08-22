const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs');


function chapterGenerator(capNumber, plusOne) {
    const options = {
        uri: `https://kisslightnovels.info/novel/solo-leveling-web-novel-free-light/solo-levelingi-${plusOne ? capNumber + 1 : capNumber}/`,
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    rp(options)
        .then(($) => {
            let chapterText = ''
            $('.text-left').children('p').each((i, item) => {
                chapterText += '\n'
                chapterText += $(item).text()
            })
            fs.writeFile(`chapters/chapter-${capNumber}.txt`, chapterText, function (err) {
                if (err) return console.log(err);
                console.log(`Chapter ${capNumber} OK`);
            });
        })
        .catch((err) => {
            console.log(`Chapter ${capNumber} ERROR. RETRYING...`);
            chapterGenerator(capNumber)

        })

}


function novelGenerator(start, end) {
    var dir = './chapters';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    for (let chapter = start; chapter < end; chapter++) {

        chapterGenerator(chapter, true)
    }

}

novelGenerator(192, 269)