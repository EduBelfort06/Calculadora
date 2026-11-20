// Funções e variáveis globais para calculadora científica
let angleMode = 'deg'; // 'deg' ou 'rad'
let shift = false; // 2nd: troca sin/cos/tan pelas versões hiperbólicas
let novoCalculo = false; // true logo depois de mostrar um resultado

function toggleAngleMode() {
    angleMode = (angleMode === 'deg') ? 'rad' : 'deg';
    const btn = document.getElementById('btn-deg');
    if (btn) btn.innerText = angleMode === 'deg' ? 'Deg' : 'Rad';
}

function toggleShift() {
    shift = !shift;
    const btn = document.getElementById('btn-shift');
    if (btn) btn.setAttribute('aria-pressed', shift);
    document.querySelectorAll('[data-alt]').forEach(b => {
        [b.dataset.fn, b.dataset.alt] = [b.dataset.alt, b.dataset.fn];
        b.textContent = b.dataset.fn.slice(0, -1);
    });
}

function mudarModo(modo, elemento) {
    const calc = document.getElementById('calc-container');
    const painelCientifico = document.getElementById('painel-cientifico-toggle');
    
    // Remove classe ativa de todos os botões de modo
    document.querySelectorAll('.btn-modo').forEach(btn => btn.classList.remove('active'));
    elemento.classList.add('active');

    if (modo === 'cientifica') {
        calc.classList.add('modo-cientifico');
        painelCientifico.style.display = 'block';
    } else {
        calc.classList.remove('modo-cientifico');
        painelCientifico.style.display = 'none';
    }
}

// Adiciona valores ao visor com validações simples
function adicionarValor(caractere) {
    const visor = document.getElementById('resultado');
    if (!visor) return;

    // Depois de "=": operador continua a conta, qualquer outra tecla começa uma nova
    if (novoCalculo) {
        novoCalculo = false;
        if (visor.innerText === "Erro" || !/^[+\-*/^!]/.test(caractere)) visor.innerText = "";
    }

    // Evita começar com operadores binários inválidos
    const primeiroValido = ['/', '*', '+'];
    if (visor.innerText === "" && primeiroValido.includes(caractere)) return;

    visor.innerText += caractere;
}

function limpar() {
    novoCalculo = false;
    document.getElementById('resultado').innerText = "";
}

function apagarUltimo() {
    const visor = document.getElementById('resultado');
    novoCalculo = false;
    if (visor.innerText === "Erro") visor.innerText = "";
    visor.innerText = visor.innerText.substring(0, visor.innerText.length - 1);
}

// Conversões e helpers usados na transformação da expressão
// π/180 não é exato: cos(90°) daria 6e-17 em vez de 0
const zerarResiduo = v => Math.abs(v) < 1e-12 ? 0 : v;
function sinf(x) {
    if (angleMode === 'deg') x = x * Math.PI / 180;
    return zerarResiduo(Math.sin(x));
}
function cosf(x) {
    if (angleMode === 'deg') x = x * Math.PI / 180;
    return zerarResiduo(Math.cos(x));
}
function tanf(x) {
    if (angleMode === 'deg' && Math.abs(x % 180) === 90) return NaN; // tan(90°) é indefinida
    if (angleMode === 'deg') x = x * Math.PI / 180;
    return zerarResiduo(Math.tan(x));
}
function asinf(x) {
    let v = Math.asin(x);
    if (angleMode === 'deg') v = v * 180 / Math.PI;
    return v;
}
function acosf(x) {
    let v = Math.acos(x);
    if (angleMode === 'deg') v = v * 180 / Math.PI;
    return v;
}
function atanf(x) {
    let v = Math.atan(x);
    if (angleMode === 'deg') v = v * 180 / Math.PI;
    return v;
}

function fact(n) {
    // só suporta inteiros não-negativos
    n = Number(n);
    if (!Number.isFinite(n) || n < 0 || Math.floor(n) !== n) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

// Transforma expressões com tokens da interface para código JS executável
function transformarExpressao(expr) {
    if (!expr) return expr;

    // Multiplicação implícita: 2π, 2(3), (1)(2), 2sin(30), π2 -> com '*'
    expr = expr.replace(/([\d.)π!])(?=[(πa-z])/g, '$1*');
    expr = expr.replace(/([)π!])(?=[\d.])/g, '$1*');

    // Menos unário vira (-1)*: em JS "-2**2" e "5--3" são erro de sintaxe; assim -2^2 = -(2^2) = -4
    expr = expr.replace(/(^|[(+\-*/])-/g, '$1(-1)*');

    // Normaliza o símbolo pi ou π
    expr = expr.replace(/π/g, 'pi');

    // Substituições diretas (palavras inteiras)
    expr = expr.replace(/\bpi\b/g, 'Math.PI');
    // log antes de ln: senão o "log(" de "Math.log(" vira "Math.Math.log10("
    expr = expr.replace(/\blog\(/g, 'Math.log10('); // log base 10
    expr = expr.replace(/\bln\(/g, 'Math.log('); // ln -> natural log
    expr = expr.replace(/\bsqrt\(/g, 'Math.sqrt(');
    expr = expr.replace(/\bexp\(/g, 'Math.exp(');
    expr = expr.replace(/\b(sinh|cosh|tanh)\(/g, 'Math.$1(');

    // Funções trig - encaminhar para wrappers que respeitam o modo (deg/rad)
    expr = expr.replace(/\bsin\(/g, 'sinf(');
    expr = expr.replace(/\bcos\(/g, 'cosf(');
    expr = expr.replace(/\btan\(/g, 'tanf(');
    expr = expr.replace(/\basin\(/g, 'asinf(');
    expr = expr.replace(/\bacos\(/g, 'acosf(');
    expr = expr.replace(/\batan\(/g, 'atanf(');

    // Potência: ^ para **
    expr = expr.replace(/\^/g, '**');

    // Trata ponto flutuante com expoente EXP(...)
    // 'exp(' já mapeado para Math.exp

    // Trata fatorial (postfix !) — precisa identificar o operando anterior
    expr = transformarFatorial(expr);

    return expr;
}

// Transformar fatorial de forma segura: converte "n!" ou "(expr)!" em fact(n) ou fact(expr)
function transformarFatorial(expr) {
    let i = 0;
    while ((i = expr.indexOf('!')) !== -1) {
        // encontra o início do operando que precede o '!'
        let j = i - 1;
        if (j < 0) break;
        if (expr[j] === ')') {
            // busca parêntese correspondente
            let depth = 0;
            let k = j;
            for (; k >= 0; k--) {
                if (expr[k] === ')') depth++;
                else if (expr[k] === '(') {
                    depth--;
                    if (depth === 0) break;
                }
            }
            if (k < 0) break; // parêntese não casado
            // inclui o nome da função antes do '(' (ex: sinf(30)!)
            while (k > 0 && /[A-Za-z0-9.]/.test(expr[k - 1])) k--;
            const inside = expr.slice(k, i);
            const before = expr.slice(0, k);
            const after = expr.slice(i + 1);
            expr = before + 'fact(' + inside + ')' + after;
        } else {
            // extrai número/identificador simples antes do '!'
            let k = j;
            while (k >= 0 && /[0-9\.A-Za-z]/.test(expr[k])) k--;
            const token = expr.slice(k + 1, i);
            const before = expr.slice(0, k + 1);
            const after = expr.slice(i + 1);
            expr = before + 'fact(' + token + ')' + after;
        }
    }
    return expr;
}

// Calcula e exibe resultado
function calcularResultado() {
    const visor = document.getElementById('resultado');
    const expressaoOriginal = visor.innerText;

    if (!expressaoOriginal) {
        visor.innerText = "";
        return;
    }

    try {
        let expr = expressaoOriginal;
        expr = transformarExpressao(expr);

        // Avalia de forma isolada
        const resultadoFinal = Function('return (' + expr + ')')();

        if (isNaN(resultadoFinal) || !isFinite(resultadoFinal)) {
            visor.innerText = "Erro";
        } else {
            // 12 dígitos significativos: tira lixo de ponto flutuante sem zerar números pequenos
            // "E" maiúsculo: o JS escreve 1e+21, mas a calculadora só entende "E" para continuar a conta
            visor.innerText = String(Number(resultadoFinal.toPrecision(12))).toUpperCase();
        }
        novoCalculo = true;
    } catch (error) {
        console.error('Erro ao avaliar expressão:', error);
        visor.innerText = "Erro";
    }
}
