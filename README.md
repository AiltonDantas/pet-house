# 🐾 Pet House

Sistema de gerenciamento para clínica veterinária, desenvolvido para facilitar o controle de animais, tutores, atendimentos, consultas, serviços e pagamentos.

O projeto possui um **backend em Java Spring Boot**, um **frontend em React** e utiliza **MySQL** como banco de dados.

---

# 🚀 Tecnologias utilizadas

## Backend
- Java 17+
- Spring Boot 3
- Spring Data JPA
- Hibernate
- MySQL
- Maven

## Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- Axios

## Banco de Dados
- MySQL 8

---

# 📁 Estrutura do projeto

```
Pet House
│
├── backend
│   ├── src
│   │   └── main
│   │       ├── java
│   │       └── resources
│   │           ├── application.properties
│   │           └── banco.sql
│   │
│   └── pom.xml
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Como executar o projeto

## 1. Clonar o repositório

```bash
git clone https://github.com/AiltonDantas/pet-house.git
```

Acesse a pasta:

```bash
cd pet-house
```

---

# 🗄️ Configuração do Banco de Dados

Certifique-se que o MySQL está instalado e funcionando.

Entre no MySQL:

```bash
mysql -u root -p
```

Crie o banco de dados:

```sql
CREATE DATABASE pethouse;
```

Depois:

```sql
USE pethouse;
```

As tabelas serão criadas automaticamente pelo sistema.

---

# 🔧 Configuração do Backend

Entre na pasta:

```bash
cd backend
```

Configure o arquivo:

```
src/main/resources/application.properties
```

Exemplo:

```properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/pethouse?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root123

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.open-in-view=false
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

Execute o backend:

```bash
mvn spring-boot:run
```

Backend:

```
http://localhost:8080
```

---

# 💻 Configuração do Frontend

Abra outro terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# 🔗 Comunicação com a API

O frontend utiliza Axios para comunicação com o backend.

Arquivo:

```
frontend/src/services/api.js
```

Configuração:

```javascript
baseURL: "http://localhost:8080/api"
```

---

# 📌 Funcionalidades

## 👤 Usuários
- Cadastro de usuários
- Login no sistema
- Controle de acesso

## 🐶 Animais
- Cadastro de animais
- Associação com tutores
- Consulta de informações

## 👨‍⚕️ Atendimentos
- Registro de atendimentos
- Histórico de consultas

## 💊 Serviços
- Cadastro de serviços veterinários

## 💳 Pagamentos
- Controle financeiro dos atendimentos

---

# 🗃️ Banco de Dados

Principais tabelas:

- usuarios
- tutores
- animais
- atendimentos
- consultas
- servicos
- atendimento_servicos
- pagamentos

---

# 🛠️ Requisitos

Para executar o projeto é necessário:

- Java JDK 17 ou superior
- Maven
- Node.js
- MySQL 8

---

# 👨‍💻 Desenvolvedor

**Ailton Dantas**

Projeto desenvolvido para estudo e prática de desenvolvimento Full Stack.

---

# 📄 Licença

Projeto de uso acadêmico e educacional.
