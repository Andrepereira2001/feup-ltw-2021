const fs = require('fs');
const path = require('path');
let url = require('url');


//const documentRoot = '/net/areas/homes/up201905650/public_html/src';
const documentRoot = 'C:\\Users\\adbp\\Documents\\FEUP\\3ano\\1semestre\\LTW\\feup-ltw-2021\\src';
const defaultIndex = 'index.html';
const mediaTypes = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'gif': 'image/gif',
};


const getMediaType = (pathname) => {
    const lastDot = pathname.lastIndexOf('.');
    let mediaType;

    if (lastDot !== -1)
        mediaType = mediaTypes[pathname.substring(lastDot + 1)];

    if (mediaType === undefined)
        mediaType = 'text/plain';
    return mediaType;
}

const isText = (mediaType) => {
    return !mediaType.startsWith('image');
}

const getPathname = (req) => {
    const purl = url.parse(req.url);
    let pathname = path.normalize(documentRoot + purl.pathname);

    if (!pathname.startsWith(documentRoot)){

        pathname = null;
    }
    return pathname;
}

const doGetPathname = (pathname, res) => {
    const mediaType = getMediaType(pathname);
    const encoding = isText(mediaType) ? 'utf-8' : null;

    fs.readFile(pathname, encoding, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': mediaType });
            res.end(data);
        }
    });
}


module.exports.call = (req, res) => {
    const pathname = getPathname(req);
    if (pathname === null) {
        res.writeHead(403);
        res.end();
    } else {
        fs.stat(pathname, (err, stats) => {
            if (err) {
                res.writeHead(500);
                res.end();
            } else if (stats.isDirectory()) {
                if (pathname.endsWith('/')) {
                    doGetPathname(pathname + defaultIndex, res);
                } else {
                    res.writeHead(301, { 'Location': pathname + '/' });
                    res.end();
                }
            } else {
                doGetPathname(pathname, res);
            }
        });
    }
}