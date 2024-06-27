import express from 'express';
import { json } from 'express';

const app = express()

// Middleware para processar JSON
app.use(json());

// Rota raiz
app.get('/', (req, res) => {
    res.send('Caixa Eletrônico API!');
});

/**
 *  Endpoint POST /api/saque
 * 
 *  Calcula a menor quantidade de cédulas necessárias para um saque especificado.
 * 
 *  Requisição:
 *  {
 *  "valor": <number> - Valor do saque desejado (inteiro positivo)
 *  }
 * 
 *  Resposta:
 *  {
 *  "100": <number>,
 *  "50": <number>,
 *  "20": <number>,
 *  "10": <number>,
 *  "5": <number>,
 *  "2": <number>
 *  }
 * 
 *  Códigos de status:
 *  - 200 OK: Retorna a distribuição das cédulas.
 *  - 400 Bad Request: Quando o valor de saque não é um número inteiro positivo ou não pode ser atendido com as cédulas disponíveis.
 */

app.post('/api/saque', (req, res) => {
    const valor = req.body.valor;

    // Verificação se o valor é um número inteiro positivo
    if (!Number.isInteger(valor) || valor <= 0) {
        return res.status(400).json({ error: 'Valor de saque inválido' });
    }

    // Array das cédulas disponíveis em ordem decrescente
    const cedulas = [100, 50, 20, 10, 5, 2];
    let restante = valor;
    const resultado = {};

    // Inicialização do resultado com zero cédulas de cada tipo
    for (let cedula of cedulas) {
        resultado[cedula] = 0;
    }

    // Cálculo da quantidade de cada cédula necessária
    for (let cedula of cedulas) {
        if (restante >= cedula) {
            resultado[cedula] = Math.floor(restante / cedula);
            restante %= cedula;
        }
    }

    // Verificação se o valor restante é maior que zero
    if (restante > 0) {
        return res.status(400).json({ error: 'Não é possível sacar o valor exato com as cédulas disponíveis' });
    }

    // Resposta com a quantidade de cédulas necessárias
    res.json(resultado);
});

export default app;

