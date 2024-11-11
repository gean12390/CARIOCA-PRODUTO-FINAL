CREATE DATABASE pedidos_db;

USE pedidos_db;

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeCliente VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL
);

select * from pedidos;

