// DADOS DOS USUÁRIOS
let usuarios = [
  { id: 1, nome: "admin", email: "admin@taskflow.com", senha: "1234" },
  { id: 2, nome: "lavi", email: "lavi@taskflow.com", senha: "5678" },
  { id: 3, nome: "tony", email: "tony@taskflow.com", senha: "1357" },
];

let proximoIdUsuario = 4;

module.exports = {
    listarUsuarios: () => usuarios,

    buscarUsuario: (id) => 
        usuarios.find((u) => u.id === id),

    buscarPorEmail: (email) => 
        usuarios.find((usuario) => usuario.email === email), 

    adicionarUsuario: ({nome, email, senha}) => {
        const novoUsuario = {
            id: proximoIdUsuario++,
            nome,
            email,
            senha,
        };
        usuarios.push(novoUsuario);
        return novoUsuario;
    },

    atualizarUsuario: (id, dados) => {
        const idx = usuarios.findIndex((u) => u.id === id);
        if (idx === -1) return null;
        usuarios[idx] = {
            ...usuarios[idx],
            ...dados,
            ...id,
        };
        return usuarios.splice(idx, 1)[0];
    },
    removerUsuario: (id) => {
        const idx = usuarios.findIndex(
            (u) => u.id === id
        );
        if (idx === -1) return null; 
        return usuarios.splice(idx, 1)[0];
    },
};