// Teste rápido da lógica da calculadora: node teste.js
const assert = require('assert');
var visor = { innerText: '' };
global.document = { getElementById: () => visor, querySelectorAll: () => [] };
require('vm').runInThisContext(require('fs').readFileSync(__dirname + '/script.js', 'utf8'));

function conta(teclas) {
    visor.innerText = '';
    limpar();
    for (const t of teclas) t === '=' ? calcularResultado() : adicionarValor(t);
    return String(visor.innerText);
}

const casos = [
    [['2', '+', '3', '='], '5'],
    [['-', '2', '^2', '='], '-4'],
    [['sin(', '3', '0', ')', '='], '0.5'],
    [['3', '!', '='], '6'],
    [['cos(', '9', '0', ')', '='], '0'],
    [['sin(', '1', '8', '0', ')', '='], '0'],
    [['tan(', '1', '8', '0', ')', '='], '0'],
    [['1', 'E', '2', '1', '=', '+', '1', '='], '1E+21'],
    [['1', 'E', '-', '9', '=', '*', '2', '='], '2E-9'],
];
for (const [teclas, esperado] of casos) assert.strictEqual(conta(teclas), esperado, teclas.join(''));
console.log('ok:', casos.length, 'casos');
