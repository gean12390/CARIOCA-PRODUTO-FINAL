const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Inicializando o app Express
const app = express();
const port = 3000;

// Configurar CORS (permitir acessos do frontend)
app.use(cors());

// Analisador de corpo JSON
app.use(express.json());

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // Substitua pelo seu usuário MySQL
  password: '',         // Substitua pela sua senha MySQL
  database: 'pedidos_db'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Rota para obter todos os pedidos
app.get('/pedidos', (req, res) => {
  db.query('SELECT * FROM pedidos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
    res.json(results);
  });
});

// Rota para obter um pedido específico pelo ID
app.get('/pedidos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM pedidos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar pedido:', err);
      return res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(results[0]);
  });
});

// Rota para adicionar um novo pedido
app.post('/pedidos', (req, res) => {
  const { nomeCliente, item, quantidade } = req.body;
  const query = 'INSERT INTO pedidos (nomeCliente, item, quantidade) VALUES (?, ?, ?)';
  
  db.query(query, [nomeCliente, item, quantidade], (err, results) => {
    if (err) {
      console.error('Erro ao inserir pedido:', err);
      return res.status(500).json({ error: 'Erro ao inserir pedido' });
    }
    res.status(201).json({
      id: results.insertId,
      nomeCliente,
      item,
      quantidade
    });
  });
});

// Rota para editar um pedido existente
app.put('/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const { nomeCliente, item, quantidade } = req.body;
  
  const query = 'UPDATE pedidos SET nomeCliente = ?, item = ?, quantidade = ? WHERE id = ?';
  
  db.query(query, [nomeCliente, item, quantidade, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar pedido:', err);
      return res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json({
      id,
      nomeCliente,
      item,
      quantidade
    });
  });
});

// Rota para deletar um pedido
app.delete('/pedidos/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM pedidos WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar pedido:', err);
      return res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json({ message: `Pedido com ID ${id} deletado` });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
