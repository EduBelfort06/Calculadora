


// Função para adicionar números e operadores no visor
function adicionarValor(caractere) {
    const visor = document.getElementById('resultado');
    
    
    
    // Evita acumular múltiplos pontos seguidos ou começar com operadores inválidos
    if (visor.innerText === "" && ['/', '*', '+'].includes(caractere)) {
        return;
    }
    
    visor.innerText += caractere;
}



// Função para limpar todo o visor (Botão C)
function limpar() {
    document.getElementById('resultado').innerText = "";
}



// Função para apagar o último caractere digitado (Botão <)
function apagarUltimo() {
    const visor = document.getElementById('resultado');
    visor.innerText = visor.innerText.substring(0, visor.innerText.length - 1);
}



// Função que calcula e exibe o resultado final (Botão =)
function calcularResultado() {
    const visor = document.getElementById('resultado');
    const expressao = visor.innerText;

    if (expressao) {
        try {
            // Avalia a string matemática e exibe o resultado
            const resultadoFinal = eval(expressao);
            


            // Verifica se o resultado é um número válido (evita divisão por zero retornando Infinity)
            if (isNaN(resultadoFinal) || !isFinite(resultadoFinal)) {
                visor.innerText = "Erro";
            } else {
            
            
                // Ajusta casas decimais se for um número quebrado longo
                visor.innerText = Number(resultadoFinal.toFixed(4));
            }
        } catch (error) {
            visor.innerText = "Erro";
        }
    } else {
        visor.innerText = "";
    }
}