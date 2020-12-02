'use strict';

const fs = require('fs');
let jsonData = require('./balagha.json');

 
let data = JSON.stringify(jsonData, null, 2);

let zdata = `\
# {TITLE}
                
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/{VID}?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen">
</iframe><BR>

## Resources:
- [Slides](https://github.com/arshare/resources_balagha_pdfs)
- [Youtube video]({YT})

`;

jsonData.lessons.forEach((x, index) => { 
    var temp,
        lesson = jsonData.lessons[index],
        title = lesson.title,
        yt = lesson.yt, // ex: https://www.youtube.com/watch?v=piwJQkD47Y0&list=PLzn0qdi6JpdvvXVuJ7kIusNquSxeyKJvc
        ytCode = yt.replace('https://www.youtube.com/watch?v=', '').replace('&list=PLzn0qdi6JpdvvXVuJ7kIusNquSxeyKJvc', ''),
        ytEmbed = 'https://www.youtube-nocookie.com/embed/' + ytCode + '?start=0',
        filename = (index+1) + '.md', // TODO: later probably add padding to number??
        zzz;
    temp = zdata.replace(/\{TITLE\}/g, title);
    temp = zdata.replace(/\{VID\}/g, ytCode);
    temp = zdata.replace(/\{YT\}/g, yt);
    // console.log([x, index, title, yt, ytCode])

    fs.writeFile(filename, temp, (err) => {
        if (err) throw err;
        console.log(filename + ': Data written to file');
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