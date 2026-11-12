const validar = require('../src/middlewares/validar');
const schemas = require('../src/middlewares/schemas');

// Uma tarefa com todos os campos certos
function tarefaValida() {
  return {
    texto: 'Revisar o plano de teste',
    prioridade_id: 2,
    coluna: 'afazer',
    usuario_id: 1,
    projeto_id: 1,
  };
}

// Executa a função e devolve o erro que ela lançou
function pegarErro(funcao) {
  try {
    funcao();
  } catch (erro) {
    return erro;
  }
}

describe ('validar', () => {
    test('chama o next quando os dados estão corretos', () => {
        const middlewares = validar(schemas.tarefa);
        const req = { body: tarefaValida() };
        const next = jest.fn();

        middlewares(req, {}, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });

     test('sem body: 400 com um detalhe por campo obrigatório', () => {
    const middleware = validar(schemas.tarefa);
    const req = {};
    const next = jest.fn();
 
    const erro = pegarErro(() => middleware(req, {}, next));
 
    expect(erro.status).toBe(400);
    expect(erro.message).toBe('Dados inválidos');
    expect(erro.detalhes).toEqual([
      "O campo 'texto' é obrigatório",
      "O campo 'prioridade_id' é obrigatório",
      "O campo 'coluna' é obrigatório",
      "O campo 'usuario_id' é obrigatório",
      "O campo 'projeto_id' é obrigatório",
    ]);
    expect(next).not.toHaveBeenCalled();
  });

    test('coluna fora da lista: diz os valores aceitos', () => {
    const middleware = validar(schemas.tarefa);
    const req = { body: { ...tarefaValida(), coluna: 'feito' } };
    const next = jest.fn();
    const erro = pegarErro(() => middleware(req, {}, next));
 
    expect(erro.detalhes).toEqual([
      "O campo 'coluna' deve ser um de: afazer, andamento, concluido",
    ]);
    expect(next).not.toHaveBeenCalled();
  });


});