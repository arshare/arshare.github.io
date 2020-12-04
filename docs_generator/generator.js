'use strict';

const fs = require('fs');
let balagha = require('./balagha.json');
let nahw = require('./nahw.json');
let sarf = require('./sarf.json');
let qisas = require('./qisas.json');

let jsonData = {
    balagha,
    nahw,
    sarf,
    qisas,
};

// Support multiple collections of data
var collections = [
    'balagha',
    'nahw',
    'sarf',
    'qisas',
];

var resources_repos = {
    pdfs: [
        'https://arshare.github.io/resources_balagha_pdfs/',
        'https://arshare.github.io/resources_hidayatunnahw_pdfs/',
    ],
    mp3s: [
        'https://arshare.github.io/resources_sarf_mp3/'
    ],
}

/// let data = JSON.stringify(jsonData, null, 2);

let zdata_yt_title = '# {TITLE}\n\n';
let zdata_yt_iframe = `\
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/{VID}?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe><BR>\n\n\
`;
let zdata_pdf_embed = `\
<h2>Slides</h2>
<div>
    <object
    data='{PDF}'
    type="application/pdf"
    width="560"
    height="315"
    >
    <iframe
        src='{PDF}'
        width="500"
        height="315"
    >
    <p>This browser does not support PDF!</p>
    </iframe>
    </object>
</div>
<A HREF='{PDF}' target=_>(Open in new window)</A>\n<BR><BR>
`;

let zdata_book_images_header = `\
<H2>Book Images:</H2>\n`;
let zdata_book_images = `\
<IMG SRC='https://arshare.github.io/resources_hidayatunnahw_book_images/{IMG}.png' class=bookpage style="max-width: 30%;">&nbsp;&nbsp;`;
// ex: <img src="https://raw.githubusercontent.com/hnshare/hn-data-classic-annotated-more/main/007.png" class="bookpage">
let zdata_book_images_footer = `\
<BR>(to enlarge, right click image & open in new window)`;

let zdata_resources = `\
<BR><BR>
## Resources:
Direct links to:
`;
let zdata_slide = '- [Slides]({PDF})\n';
let zdata_yt_link = '- [Youtube video]({YT})\n';
let zdata_resources_end = `\
<BR><BR>
## Credits:
All Videos & Slides are provided selflessly by AlQalam Institute's Shaykh Hashim.
- [Al Qalam Institute website](https://www.alqalaminstitute.org/)
- [Al Qalam Youtube](https://www.youtube.com/c/AlQalamInstitute/playlists)
- [- YT playlist - Duroosul Balagha](https://www.youtube.com/watch?v=cZsrvqzphNk&list=PLzn0qdi6JpdvvXVuJ7kIusNquSxeyKJvc)
- [- YT playlist - Hidayatun Nahw](https://www.youtube.com/playlist?list=PLzn0qdi6JpdtdAyaM2yvvY1Yk9i4EpLHD)
- [- YT playlist - Qisas](https://www.youtube.com/watch?v=bXdYFJm4eAE&list=PLzn0qdi6JpduA_Vp7eglKKs8eDGjqYdd3)
- [- YT playlist - Sarf](https://www.youtube.com/watch?v=FEPiOBUYlLw&list=PLzn0qdi6JpdvWf0IDGNfaiM-okPqDuQoc)
- [Link to AlQalam Resources](https://www.alqalaminstitute.org/resources)
- [Link to AlQalam Dropbox](https://www.dropbox.com/sh/vtojey2cm76xvyr/AAC-M3mnMaHkYLGxQCvmEiLga?dl=0)
`;

function stitchData(){

}
let zdata = `\
# {TITLE}

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/{VID}?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
<BR>

## Resources:
- [Slides](https://github.com/arshare/resources_balagha_pdfs)
- [Youtube video]({YT})

`;

// Fns padding related; pad Fn normally pads to 3 length; pass in 2 for padLength if wanted.
function getPadLength( jsonData ){
    var highestLessonNumber = jsonData.lessons.length - 1;
    var padLength = highestLessonNumber >= 100 ? 3 : highestLessonNumber >= 10 ? 2 : 1;
    return padLength;    
}
function pad(number, padLength){
    number = number && (number+'');
    var paddednumber = !number ? null : number.length==3 ? number : number.length==2? ('0'+number) : number.length==1? ('00'+number) : null;
    if(padLength == 2)
        paddednumber = !number ? null : number.length==2 ? number : number.length==1? ('0'+number) : null;
    return paddednumber;
}


collections.forEach((collection, n) => {

    jsonData[ collection ].lessons.forEach((x, index) => { 
        var temp,
            lesson = jsonData[ collection ].lessons[index],
            title = lesson.title,
            yts = !lesson.yt ? ( !lesson.id ? [] : [ lesson.id ] ) : ( !Array.isArray(lesson.yt) ? [ lesson.yt ] : lesson.yt ), 
            ytCodes = [],
            pdf = lesson.slides,
            pdfLinkPrefix = resources_repos.pdfs.find(x => x.indexOf( collection ) !== -1),
            pdfLinkSuffix = pdf && pdf.indexOf('.pdf') !== -1 ? '' : '.pptx.pdf',
            pdfLink = (!pdf || !pdfLinkPrefix) ? null : (pdfLinkPrefix + pdf + pdfLinkSuffix),
            bookpage = lesson.page,
            filenameNoExt = (index+1), // TODO: later probably add padding to number??
            padLength = getPadLength( jsonData[ collection ] ),
            filepath = '../docs/'+ collection +'/',
            filename = filepath + pad(filenameNoExt, padLength) + '.md',
            zzz;
        temp = zdata_yt_title.replace(/\{TITLE\}/g, title);
        yts.forEach((yt) => { if(!yt){ ytCodes.push(null); return; }
            // yt ex: https://www.youtube.com/watch?v=piwJQkD47Y0&list=PLzn0qdi6JpdvvXVuJ7kIusNquSxeyKJvc
            var ytCode = yt && yt.replace('https://www.youtube.com/watch?v=', '')
                             .replace('&list=PLzn0qdi6JpdvvXVuJ7kIusNquSxeyKJvc', '') // balagha yt playlist
                             .replace('&list=PLzn0qdi6JpdtdAyaM2yvvY1Yk9i4EpLHD', '') // nahw yt playlist
                             .replace('&list=PLzn0qdi6JpdvWf0IDGNfaiM-okPqDuQoc', '') // sarf yt playlist
                             .replace('&index=$INDEX', '')
                             .replace(/\&index=[0-9]+/, '');
                // ytEmbed = ytCode && ('https://www.youtube-nocookie.com/embed/' + ytCode + '?start=0');
            ytCodes.push( ytCode );
        });
        ytCodes.forEach((ytCode) => {
            temp += zdata_yt_iframe.replace(/\{VID\}/g, ytCode);
        });
        if(pdfLink) temp += zdata_pdf_embed.replace(/\{PDF\}/g, pdfLink);
        if(bookpage){
            temp += zdata_book_images_header;
            var pagesCount = jsonData[ collection ].lessons.length - 1;
            var bookpageNext = index >= pagesCount ? bookpage : jsonData[ collection ].lessons[index + 1].page;
            for(var i = parseInt(bookpage); i <= parseInt(bookpageNext); ++i){
                temp += zdata_book_images.replace(/\{IMG\}/g, pad( i ));
            }
            temp += zdata_book_images_footer;
        }

        // now the resources...
        temp += zdata_resources;
        if(pdfLink) temp += zdata_slide.replace(/\{PDF\}/g, pdfLink);
        yts.forEach((yt) => {
            var ytLink = yt.indexOf('/') !== -1 ? yt : ('https://youtu.be/' + yt);
            temp += zdata_yt_link.replace(/\{YT\}/g, ytLink);
        });
        temp += zdata_resources_end;

        fs.mkdirSync(filepath, {recursive:true});
        fs.writeFile(filename, temp, (err) => {
            if (err) throw err;
            console.log(filename + ': Data written to file');
        });    
    });
});


console.log('This is after the write call');


/*
'use strict';

let jsonData = require('./balagha.json');

console.log(jsonData);
*/

/*
'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('balagha.json');
let data = JSON.parse(rawdata);
console.log( data );
*/