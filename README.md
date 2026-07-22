# 🐾 Pet House

Sistema web para gerenciamento de clínicas veterinárias, desenvolvido como projeto acadêmico. O sistema permite controlar tutores, animais, consultas, atendimentos, pagamentos, serviços e usuários de forma prática e organizada.

## 📖 Sobre o projeto

O **Pet House** foi criado com o objetivo de facilitar a administração de clínicas veterinárias, oferecendo um sistema completo para gerenciamento dos principais processos do estabelecimento.

### Funcionalidades

- 👤 Cadastro de usuários
- 🐶 Cadastro de animais
- 👨‍👩‍👧 Cadastro de tutores
- 📅 Agendamento de consultas
- 🩺 Controle de atendimentos
- 💳 Gerenciamento de pagamentos
- 📋 Cadastro de serviços
- 📊 Relatórios do sistema

---

# 🛠 Tecnologias utilizadas

## Backend

- Java 21
- Spring Boot
- Spring Data JPA
- Maven
- MySQL

## Frontend

- React
- JavaScript
- HTML5
- CSS3
- Axios

---

# 📁 Estrutura do projeto

```
Pet House
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── Dockerfile
└── README.md
```

---

# 🚀 Como executar o projeto

## Pré-requisitos

- Java 21+
- Maven 3.9+
- Node.js 18+
- MySQL
- Git

---

## 1. Clone o projeto

```bash
git clone https://github.com/SEU-USUARIO/pet-house.git
```

Entre na pasta:

```bash
cd pet-house
```

---

## 2. Executando o Backend

Entre na pasta:

```bash
cd backend
```

Execute:

```bash
mvn spring-boot:run
```

O servidor ficará disponível em:

```
http://localhost:8080
```

---

## 3. Executando o Frontend

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
npm start
```

O sistema abrirá em:

```
http://localhost:3000
```

---

# 🗄 Banco de Dados

O projeto utiliza **MySQL**.

Configure o banco de dados no arquivo:

```
application.properties
```

Exemplo:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pethouse
spring.datasource.username=root
spring.datasource.password=senha
```

---

# 📚 API

O backend possui endpoints REST para gerenciamento de:

- Usuários
- Animais
- Tutores
- Consultas
- Atendimentos
- Pagamentos
- Serviços
- Relatórios

---

# 📌 Arquitetura

O backend segue a arquitetura em camadas:

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Banco de Dados
```

---

# 👨‍💻 Desenvolvedores

Projeto desenvolvido para fins acadêmicos.

Equipe:

- Ailton Santos Dantas

---

# 📄 Licença

Este projeto foi desenvolvido para fins educacionais.
