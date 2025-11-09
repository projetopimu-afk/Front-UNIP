# Portal UNIP - Frontend Autônomo

Esta é uma aplicação frontend **autônoma** (standalone) para o Portal UNIP, construída com React e TypeScript.

## Informação Importante: Não é Necessário um Servidor!

Este projeto foi projetado para funcionar **sem a necessidade de um servidor backend separado**. Toda a lógica de "API" e os dados são simulados localmente no navegador, utilizando dados de exemplo (mock data) que estão dentro do próprio código.

O arquivo `services.ts` gerencia os dados em memória, o que significa que você pode interagir com a aplicação (fazer login com os usuários de teste, adicionar turmas, etc.) diretamente no navegador. As alterações não serão salvas permanentemente, pois são reiniciadas a cada recarregamento da página.

## Como Executar no Vercel

Como esta é uma aplicação frontend pura que não requer um processo de compilação (build step), ela deve funcionar perfeitamente em qualquer serviço de hospedagem estática como o Vercel.

Basta fazer o deploy dos arquivos existentes. O Vercel servirá o `index.html`, e o navegador cuidará de carregar os módulos JavaScript, incluindo o React.

## Usuários de Teste

Para fins de demonstração, utilize os seguintes nomes de usuário na tela de login:

- **Professor:** `ana.silva`
- **Aluno:** `bruno.costa`
- **Gestor:** `carlos.gestor`

Qualquer senha funcionará.
