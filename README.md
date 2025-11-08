
# Servidor Backend em Python para o Portal UNIP

Este é um servidor simples em Python usando o framework **Flask** que serve como backend para a aplicação frontend em React. Ele simula um banco de dados em memória e fornece os endpoints de API necessários para o funcionamento do portal.

## Requisitos

- Python 3.6 ou superior
- `pip` (gerenciador de pacotes do Python)

## 1. Instalação

Antes de rodar o servidor, você precisa instalar as dependências necessárias. Navegue até a pasta onde salvou este arquivo e execute o seguinte comando no seu terminal:

```bash
pip install Flask Flask-Cors
```

- **Flask**: É o micro-framework web que estamos usando.
- **Flask-Cors**: É uma extensão para lidar com o Cross-Origin Resource Sharing (CORS), permitindo que seu aplicativo React (rodando em um domínio/porta diferente) faça requisições para este servidor.

## 2. Como Executar o Servidor

Após instalar as dependências, você pode iniciar o servidor com um simples comando:

```bash
python server.py
```

Se tudo ocorrer bem, você verá uma saída parecida com esta no seu terminal:

```
 * Serving Flask app 'server'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: ...
```

Isso significa que o seu servidor backend está rodando e pronto para receber requisições na porta `5000`.

## 3. Endpoints da API

O servidor expõe os seguintes endpoints, que replicam a funcionalidade do arquivo `services.ts` do frontend:

- `POST /api/login`: Autentica um usuário.
- `GET /api/users`: Retorna todos os usuários.
- `POST /api/users`: Cria um novo usuário.
- `GET /api/teachers/<teacher_id>/classes`: Retorna as turmas de um professor.
- `DELETE /api/classes/<class_id>`: Deleta uma turma.
- `GET /api/students`: Retorna todos os alunos.
- `GET /api/classes/<class_id>/students`: Retorna os alunos de uma turma específica.
- `POST /api/classes/<class_id>/students`: Adiciona um aluno a uma turma.
- `DELETE /api/classes/<class_id>/students/<student_id>`: Remove um aluno de uma turma.
- `GET /api/students/<student_id>/classes`: Retorna as turmas de um aluno.
- `GET /api/classes/<class_id>/activities`: Retorna as atividades de uma turma.
- `GET /api/students/<student_id>/activities/<activity_id>/submission`: Retorna o envio de um aluno para uma atividade.
- `POST /api/submissions`: Cria um novo envio de atividade.

E um endpoint de verificação:
- `GET /api/health`: Retorna `{"status": "ok"}` se o servidor estiver no ar.
