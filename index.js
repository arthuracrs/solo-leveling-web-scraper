const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs');
const pdfkit = require('pdfkit');

//catch a chapter from kisslightnovels.info and export the txt and pdf file 
function chapterGenerator(capNumber, plusOne) {
    const options = {
        uri: `https://kisslightnovels.info/novel/solo-leveling-web-novel-free-light/solo-levelingi-${plusOne ? capNumber + 1 : capNumber}/`,
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    rp(options)
        .then(($) => {
            //get the text
            let chapterText = ''
            $('.text-left').children('p').each((i, item) => {
                chapterText += '\n'
                chapterText += $(item).text()
            })
            //generate the pdf file
            const doc = new pdfkit;
            doc.pipe(fs.createWriteStream(`chapters/pdf/chapter-${capNumber}.pdf`))
            doc.text('', 10, 10)
            doc.text(chapterText, {
                width: 600,
                align: 'left'
            })
            doc.end();
            //generate the txt file
            fs.writeFile(`chapters/txt/chapter-${capNumber}.txt`, chapterText, function (err) {
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
    const dirs = ['./chapters', './chapters/txt/', './chapters/pdf/']

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    }

    for (let chapter = start; chapter < end; chapter++) {
        //first argument to the chapter numeber, and the second to plus one on index (cause of a bug on kisslightnovels.info)
        chapterGenerator(chapter, true)
    }

}
// first chapter and last not included chapter
novelGenerator(192, 269)