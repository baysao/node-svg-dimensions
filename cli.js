var fs = require('fs');
var path = require('path');
var svgDim = require('./svg-dimensions');
var walkPath = './';

var walk = function (dir, proc, done) {
    fs.readdir(dir, function (error, list) {
        if (error) {
            return done(error);
        }

        var i = 0;

        (function next() {
            var file = list[i++];

            if (!file) {
                return done(null);
            }

            file = dir + '/' + file;

            proc(file, next);
            // fs.stat(file, function (error, stat) {

            //     if (stat && stat.isDirectory()) {
            //         walk(file, function (error) {
            //             next();
            //         });
            //     } else {
            //         // do stuff to file here
            //         console.log(file);


            //         next();
            //     }
            // });
        })();
    });
};

if(process.argv[2]) {
    walkPath = process.argv[2];
    if(process.argv[3]) {
        outPath = process.argv[3];
    }

}

// console.log('-------------------------------------------------------------');
// console.log('processing...');
// console.log('-------------------------------------------------------------');
var output = '{';
walk(walkPath, function(file, next){



// var path = '/local/file/example.svg';
// console.log(file);
  if(!/.svg/.test(file)) return next();

svgDim.get(file, function(err, dimensions) {
    if (err) console.log(err);
    
  
    console.log("is svg")
    var filename = path.basename(file, '.svg');

    var height = dimensions.height;
    var width = dimensions.width;
    var viewBox = dimensions.viewBox;
    output = output + '"' + filename 
    + '":{' 
    + '"width":' + width + ','
    + '"height":' + height + ','
    + '"viewBox":"' + viewBox + '"'
    + '}'; 
    console.log(filename, width,height, viewBox);
    next();
});


    // console.log(file);
    // next();

},function (error) {
    if (error) {
        throw error;
    } else {
        output = output + '}';
        console.log(output);
        fs.writeFileSync(outPath, output);
        // console.log('-------------------------------------------------------------');
        // console.log('finished.');
        // console.log('-------------------------------------------------------------');
    }
});