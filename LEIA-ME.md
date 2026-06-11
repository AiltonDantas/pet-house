# 🐾 PetHouse — Sistema Completo (Frontend + Backend)

## ▶️ Como rodar — 3 passos

### 1. Banco de dados (MySQL)
```sql
source backend/src/main/resources/banco.sql
```

### 2. Backend — Spring Boot
```bash
cd backend
mvn spring-boot:run
```
✅ API em → http://localhost:8081

### 3. Frontend — React
```bash
cd frontend
npm install
npm run dev
```
✅ Sistema em → http://localhost:5173

---

## ⚙️ Configurar banco
Edite `backend/src/main/resources/application.properties`:
```
spring.datasource.username=root
spring.datasource.password=SUA_SENHA
```

---

## 🔑 Usuários de demonstração
| Email                  | Senha  | Perfil        |
|------------------------|--------|---------------|
| admin@pethouse.com     | 123456 | Administrador |
| roberto@pethouse.com   | 123456 | Recepcionista |
| carlos@pethouse.com    | 123456 | Veterinário   |

---

## 📁 Estrutura do Backend (35 arquivos Java)

```
backend/src/main/java/com/pethouse/clinica/
├── ClinicaApplication.java
├── config/
│   └── CorsConfig.java
├── model/
│   ├── Usuario.java         ← abstrata (base da herança)
│   ├── Administrador.java   ← extends Usuario + @Override
│   ├── Recepcionista.java   ← extends Usuario + @Override
│   ├── Veterinario.java     ← extends Usuario + @Override
│   ├── Tutor.java
│   ├── Animal.java
│   ├── Servico.java
│   ├── Consulta.java
│   ├── Atendimento.java
│   └── Pagamento.java
├── repository/
│   ├── UsuarioRepository.java
│   ├── TutorRepository.java
│   ├── AnimalRepository.java
│   ├── ServicoRepository.java
│   ├── ConsultaRepository.java
│   ├── AtendimentoRepository.java
│   └── PagamentoRepository.java
├── service/
│   ├── UsuarioService.java
│   ├── TutorService.java
│   ├── AnimalService.java
│   ├── ServicoService.java
│   ├── ConsultaService.java
│   ├── AtendimentoService.java
│   ├── PagamentoService.java
│   └── RelatorioService.java
└── controller/
    ├── UsuarioController.java
    ├── TutorController.java
    ├── AnimalController.java
    ├── ServicoController.java
    ├── ConsultaController.java
    ├── AtendimentoController.java
    ├── PagamentoController.java
    └── RelatorioController.java
```

## 🔗 Endpoints da API
```
POST   /api/auth/login
GET    /api/usuarios          GET /api/usuarios/veterinarios
GET    /api/tutores            POST/PUT/DELETE /api/tutores/{id}
GET    /api/animais            POST/PUT/DELETE /api/animais/{id}
GET    /api/servicos           POST/PUT/DELETE /api/servicos/{id}
GET    /api/consultas          POST/PUT/DELETE /api/consultas/{id}
PATCH  /api/consultas/{id}/cancelar|iniciar|finalizar
GET    /api/atendimentos       POST /api/atendimentos
GET    /api/pagamentos         POST/PUT /api/pagamentos/{id}
PATCH  /api/pagamentos/{id}/confirmar|cancelar
GET    /api/relatorios/dashboard
GET    /api/relatorios/consultas?inicio=&fim=
GET    /api/relatorios/faturamento/{ano}
GET    /api/relatorios/animais/especies
```
