const fs = require('fs');

/**
 * Função que lê dados de um arquivo de forma síncrona.
 * @param {*} file nome do arquivo (path) a ser lido
 */
function readFile(file) {
    console.log("Reading file " + file);
    return fs.readFileSync(fs.openSync(file, 'r'));
}

/**
 * Função que salva dados (String) em um arquivo.
 * Essa função irá abrir o arquivo no modo 'w', ou write. Assim, todos
 * os dados que já estivessem no arquivo anteriormente serão perdidos.
 * @param {*} file 
 * @param {*} data 
 */
function saveFile(file, data) {
    fs.writeFileSync(fs.openSync(file, 'w'), data);
}

/**
 * Função que lê um arquivo em formato JSON da pasta de dados (/data) 
 * @param {*} file nome do arquivo a ser lido
 * */
function readJSONFile(file) {
    return JSON.parse(readFile('data/' + file));
}

/**
 * Função que salva um arquivo em formato JSON a partir de um objeto data
 * @param {*} file nome do arquivo a ser salvo, ex: dados.json
 * @param {*} data objeto com os dados a serem salvos (será convertido para JSON)
 */
function saveJSONFile(file, data) {
    saveFile('data/' + file, JSON.stringify(data, null, 2));
}

/**
 * Declarações de exports para serem utilizadas no node.js
 */
module.exports = {
    readFile,
    saveFile,
    readJSONFile,
    saveJSONFile,
};