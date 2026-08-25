const somar = require('./calcular');

// Usar a função importada normalmente:
console.log(somar(2, 3));  // 5
console.log(somar(10, 7)); // 17


const tarefasUtils = require('./utils/tarefas');

// Destructuring — extrair funções do objeto:
const { listarTodas, adicionar } = require('./utils/tarefas');

adicionar({ id: 1, texto: 'Estudar Node', coluna: 'afazer' });
console.log(listarTodas()); // [{ id: 1, texto: 'Estudar Node', ... }]
