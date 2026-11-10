const criarErro = require('../src/utils/criarErro');

describe('criarErro', () => {
    test('devolve um error com o status e a mensagem', () => {
        const erro = criarErro(404, 'Tarefa não encontrada');

        expect(erro).toBeInstanceOf(Error);
        expect(erro.status).toBe(404);
        expect(erro.message).toBe('Tarefa não encontrada');
    });
});