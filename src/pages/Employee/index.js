import React, { useState } from 'react';

const CadastroFuncionarios = () => {
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [situacao, setSituacao] = useState('');
  const [cargo, setCargo] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Cadastro de Funcionário:', { id, nome, email, situacao, cargo });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ID:
        <input type="text" value={id} onChange={(event) => setId(event.target.value)} />
      </label>
      <label>
        Nome:
        <input type="text" value={nome} onChange={(event) => setNome(event.target.value)} />
      </label>
      <label>
        E-mail:
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Situação:
        <select value={situacao} onChange={(event) => setSituacao(event.target.value)}>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </label>
      <label>
        Cargo:
        <select value={cargo} onChange={(event) => setCargo(event.target.value)}>
          <option value="admin">Admin</option>
          <option value="estoquista">Estoquista</option>
        </select>
      </label>
      <button type="submit">Cadastrar Funcionário</button>
    </form>
  );
};

export default CadastroFuncionarios;
