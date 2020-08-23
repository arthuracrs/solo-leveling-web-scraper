const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs');
const pdfkit = require('pdfkit');

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
            const doc = new pdfkit;
            doc.pipe(fs.createWriteStream(`chapters/pdf/chapter-${capNumber}.pdf`))
            doc.text('', 10, 10)
            doc.text(chapterText, {
                width: 600,
                align: 'left'
            })
            doc.end();
            fs.writeFile(`chapters/txt/chapter-${capNumber}.txt`, chapterText, function (err) {
                if (err) return console.log(err);
                console.log(`Chapter ${capNumber} OK`);
            });
        })
        .catch((err) => {
            console.log(err)
            console.log(`Chapter ${capNumber} ERROR. RETRYING...`);
            chapterGenerator(capNumber)

        })

}


function novelGenerator(start, end) {
    let dir3 = './chapters'
    let dir1 = './chapters/txt/'
    let dir2 = './chapters/pdf/'

    if (!fs.existsSync(dir3)) fs.mkdirSync(dir3);
    if (!fs.existsSync(dir2)) fs.mkdirSync(dir2);
    if (!fs.existsSync(dir1)) fs.mkdirSync(dir1);

    for (let chapter = start; chapter < end; chapter++) {
        chapterGenerator(chapter, true)
    }

}

novelGenerator(192, 269)