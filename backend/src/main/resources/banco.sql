CREATE DATABASE IF NOT EXISTS pethouse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pethouse_db;

DROP TABLE IF EXISTS atendimento_servicos;
DROP TABLE IF EXISTS pagamentos;
DROP TABLE IF EXISTS atendimentos;
DROP TABLE IF EXISTS consultas;
DROP TABLE IF EXISTS animais;
DROP TABLE IF EXISTS tutores;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS servicos;

CREATE TABLE usuarios (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    nome          VARCHAR(100) NOT NULL,
    cpf           VARCHAR(14)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    senha         VARCHAR(255) NOT NULL,
    telefone      VARCHAR(20),
    cargo         VARCHAR(20)  NOT NULL,
    especialidade VARCHAR(80),
    crmv          VARCHAR(20),
    turno         VARCHAR(10),
    nivel_acesso  VARCHAR(20),
    ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE tutores (
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(100) NOT NULL,
    cpf       VARCHAR(14)  NOT NULL UNIQUE,
    telefone  VARCHAR(20)  NOT NULL,
    email     VARCHAR(100),
    endereco  VARCHAR(200),
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE animais (
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(80)  NOT NULL,
    especie   VARCHAR(40)  NOT NULL,
    raca      VARCHAR(60),
    idade     INT,
    peso      DECIMAL(6,2),
    historico TEXT,
    tutor_id  BIGINT       NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_animal_tutor FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE servicos (
    id        BIGINT        NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(100)  NOT NULL,
    descricao TEXT,
    valor     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE consultas (
    id             BIGINT      NOT NULL AUTO_INCREMENT,
    animal_id      BIGINT      NOT NULL,
    tutor_id       BIGINT      NOT NULL,
    veterinario_id BIGINT      NOT NULL,
    data           DATE        NOT NULL,
    horario        TIME        NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'AGENDADA',
    observacoes    TEXT,
    PRIMARY KEY (id),
    CONSTRAINT fk_cons_animal FOREIGN KEY (animal_id) REFERENCES animais(id),
    CONSTRAINT fk_cons_tutor  FOREIGN KEY (tutor_id)  REFERENCES tutores(id),
    CONSTRAINT fk_cons_vet    FOREIGN KEY (veterinario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE atendimentos (
    id            BIGINT        NOT NULL AUTO_INCREMENT,
    consulta_id   BIGINT        NOT NULL UNIQUE,
    diagnostico   TEXT          NOT NULL,
    procedimentos TEXT,
    observacoes   TEXT,
    valor_total   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (id),
    CONSTRAINT fk_atend_cons FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE atendimento_servicos (
    atendimento_id BIGINT NOT NULL,
    servico_id     BIGINT NOT NULL,
    PRIMARY KEY (atendimento_id, servico_id),
    CONSTRAINT fk_ats_atend   FOREIGN KEY (atendimento_id) REFERENCES atendimentos(id) ON DELETE CASCADE,
    CONSTRAINT fk_ats_servico FOREIGN KEY (servico_id)     REFERENCES servicos(id)
) ENGINE=InnoDB;

CREATE TABLE pagamentos (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    consulta_id     BIGINT        NOT NULL,
    valor_total     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    forma_pagamento VARCHAR(20),
    status          VARCHAR(15)   NOT NULL DEFAULT 'PENDENTE',
    data_pagamento  DATE,
    PRIMARY KEY (id),
    CONSTRAINT fk_pag_cons FOREIGN KEY (consulta_id) REFERENCES consultas(id)
) ENGINE=InnoDB;

-- Dados iniciais
INSERT INTO usuarios (nome,cpf,email,senha,telefone,cargo,nivel_acesso) VALUES
('Admin Sistema','000.000.000-00','admin@pethouse.com','123456','(11)90000-0000','Administrador','TOTAL');

INSERT INTO usuarios (nome,cpf,email,senha,telefone,cargo,turno) VALUES
('Roberto Alves','999.000.111-22','roberto@pethouse.com','123456','(11)91111-0003','Recepcionista','MANHA');

INSERT INTO usuarios (nome,cpf,email,senha,telefone,cargo,especialidade,crmv) VALUES
('Dr. Carlos Medeiros','111.222.333-44','carlos@pethouse.com','123456','(11)91111-0001','Veterinario','Clinica Geral','CRMV-SP 12345'),
('Dra. Fernanda Lima','555.666.777-88','fernanda@pethouse.com','123456','(11)91111-0002','Veterinario','Cirurgia','CRMV-SP 67890');

INSERT INTO tutores (nome,cpf,telefone,email,endereco) VALUES
('Maria Silva','123.456.789-00','(11)99999-1111','maria@email.com','Rua das Flores, 123 - SP'),
('Joao Santos','987.654.321-00','(11)98888-2222','joao@email.com','Av. Paulista, 456 - SP'),
('Ana Costa','456.789.123-00','(11)97777-3333','ana@email.com','Rua Augusta, 789 - SP');

INSERT INTO animais (nome,especie,raca,idade,peso,historico,tutor_id) VALUES
('Rex','Cao','Labrador',3,28.50,'Vacinado em dia',1),
('Mimi','Gato','Persa',2,4.20,'Castrada',2),
('Bolinha','Cao','Poodle',5,6.80,'Alergia a racao premium',3),
('Fofinho','Coelho','Mini Rex',1,1.50,'Animal saudavel',1);

INSERT INTO servicos (nome,descricao,valor) VALUES
('Consulta Clinica Geral','Consulta veterinaria padrao',150.00),
('Vacina V8','Vacina polivalente canina',85.00),
('Vacina Antirrabica','Vacina antirrabica anual',60.00),
('Banho e Tosa','Higiene e estetica',80.00),
('Exame de Sangue','Hemograma completo',120.00),
('Raio-X','Radiografia digital',200.00),
('Cirurgia Castracao','Procedimento cirurgico',500.00),
('Consulta Retorno','Consulta de retorno',80.00),
('Microchipagem','Implante de microchip',100.00);

INSERT INTO consultas (animal_id,tutor_id,veterinario_id,data,horario,status,observacoes) VALUES
(1,1,3,DATE_SUB(CURDATE(),INTERVAL 10 DAY),'09:00','FINALIZADA','Check-up anual Rex'),
(2,2,4,DATE_SUB(CURDATE(),INTERVAL 5 DAY),'10:30','FINALIZADA','Rotina Mimi'),
(3,3,3,CURDATE(),'14:00','AGENDADA','Investigar alergia'),
(4,1,4,CURDATE(),'15:30','AGENDADA','Primeira consulta Fofinho'),
(1,1,3,DATE_ADD(CURDATE(),INTERVAL 3 DAY),'08:00','AGENDADA','Retorno vacinacao');

INSERT INTO atendimentos (consulta_id,diagnostico,procedimentos,observacoes,valor_total) VALUES
(1,'Animal saudavel','Exame fisico completo. Vacina V8.','Retornar em 12 meses.',235.00),
(2,'Bom estado geral.','Exame fisico. Suplemento.','Usar suplemento 30 dias.',230.00);

INSERT INTO atendimento_servicos VALUES (1,1),(1,2),(2,1),(2,8);

INSERT INTO pagamentos (consulta_id,valor_total,forma_pagamento,status,data_pagamento) VALUES
(1,235.00,'CARTAO_CREDITO','PAGO',DATE_SUB(CURDATE(),INTERVAL 10 DAY)),
(2,230.00,'PIX','PAGO',DATE_SUB(CURDATE(),INTERVAL 5 DAY)),
(3,150.00,'PIX','PENDENTE',NULL),
(4,150.00,'DINHEIRO','PENDENTE',NULL);
