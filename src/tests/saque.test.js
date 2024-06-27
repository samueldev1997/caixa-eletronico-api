const request = require('supertest');
const app = require('../../src/app').default;

describe('POST /api/saque', () => {
    it('responde com a distribuição correta de cédulas para um valor válido', async () => {
        const valorSaque = 380;
        const response = await request(app)
            .post('/api/saque')
            .send({ valor: valorSaque });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            "100": 3,
            "50": 1,
            "20": 1,
            "10": 1,
            "5": 0,
            "2": 0
        });
    });

    it('responde com erro quando o valor de saque é negativo', async () => {
        const valorSaque = -50;
        const response = await request(app)
            .post('/api/saque')
            .send({ valor: valorSaque });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "Valor de saque inválido"
        });
    });

    it('responde com erro quando não é possível sacar o valor exato com as cédulas disponíveis', async () => {
        const valorSaque = 1;
        const response = await request(app)
            .post('/api/saque')
            .send({ valor: valorSaque });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "Não é possível sacar o valor exato com as cédulas disponíveis"
        });
    });
});
