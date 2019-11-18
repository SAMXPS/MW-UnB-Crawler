const fs = require('fs');

function readFile(file) {
    console.log("Reading file " + file);
    return fs.readFileSync(fs.openSync(file, 'r'));
}

function saveFile(file, data) {
    fs.writeFileSync(fs.openSync(file, 'w'), data);
}

function readJSONFile(file) {
    return JSON.parse(readFile('data/' + file));
}

function saveJSONFile(file, data) {
    saveFile('data/' + file, JSON.stringify(data, null, 2));
}

module.exports = {
    readFile,
    saveFile,
    readJSONFile,
    saveJSONFile,
};