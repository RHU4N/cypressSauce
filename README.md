# Testes E2E com Cypress no SauceDemo

Projeto acadêmico da disciplina **Qualidade e Testes de Software**, ministrada pelo professor **Mário de Jesus**, da **Fatec**. O objetivo é praticar a automação de testes de uma loja virtual, verificando os resultados de ações realizadas pela interface.

O sistema testado é o [SauceDemo](https://www.saucedemo.com), uma loja de demonstração. Os testes utilizam somente as credenciais públicas `standard_user` / `secret_sauce` e dados fictícios no checkout. A compra é simulada, sem pagamento real.

## Tecnologias

- JavaScript puro.
- Node.js e npm para instalação e execução.
- Cypress como dependência de desenvolvimento.
- Microsoft Edge como navegador para executar os testes.

Não é necessário executar os projetos vizinhos `api-prisma` ou `front-produtos`.

## Cenários

| Teste | Cenário | Resultado verificado |
| --- | --- | --- |
| 01 | Login válido | A página de produtos e os seis produtos são exibidos. |
| 02 | Login inválido | Uma mensagem de erro aparece e o usuário permanece no login. |
| 03 | Adicionar produtos ao carrinho | Backpack e Bike Light aparecem no carrinho, com quantidade total de dois itens. |
| 04 | Remover produto do carrinho | Após remover a Backpack, somente a Bike Light permanece. |
| 05 | Finalizar uma compra | O checkout com dados fictícios termina com a confirmação do pedido. |
| 06 | Ordenação de produtos | Os seis preços são números válidos e aparecem do menor para o maior. |
| 07 | Logout | O sistema retorna à tela de login, com os campos vazios. |

Há exatamente sete testes. Cada um começa com `cy.visit('/')` no `beforeEach()` e prepara seus próprios dados. A opção `testIsolation: true` limpa cookies e armazenamento do navegador entre testes; nenhum cenário depende do anterior.

## Estrutura

```text
saucedemo-cypress/
├── cypress/
│   ├── e2e/
│   │   └── saucedemo.cy.js
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── .gitignore
├── cypress.config.js
├── package.json
├── package-lock.json
└── README.md
```

`commands.js` define somente o comando reutilizável `cy.login()`. O arquivo `e2e.js` importa esse comando. A configuração define `baseUrl` como `https://www.saucedemo.com`.

## Instalação

Tenha Node.js 24 LTS, npm e Microsoft Edge instalados, acesso à internet e um Windows, Linux ou macOS compatível com o Cypress.

No terminal, entre na pasta do projeto antes de instalar:

```bash
cd saucedemo-cypress
npm install
```

O primeiro download inclui o aplicativo do Cypress. Para reinstalar exatamente as versões registradas no `package-lock.json`, utilize `npm ci`.

Se o PowerShell bloquear o arquivo `npm.ps1`, use `npm.cmd` no lugar de `npm`, por exemplo: `npm.cmd install` e `npm.cmd run cy:run`. Não é necessário alterar a política de execução do sistema.

## Executar pela interface

Dentro de `saucedemo-cypress`, execute:

```bash
npm run cy:open
```

O script seleciona **E2E Testing** e o **Microsoft Edge**. Caso a tela de escolha de navegador apareça, selecione **Edge** e clique em **Start E2E Testing**. Na lista de especificações, abra `saucedemo.cy.js` para acompanhar os sete testes e suas asserções.

## Executar pelo terminal

Dentro de `saucedemo-cypress`, execute:

```bash
npm run cy:run
```

O Cypress executa os sete cenários em modo headless no Microsoft Edge e mostra o resultado individual e o total de aprovados e reprovados. A opção `video: true` salva a gravação da execução em `cypress/videos/`; capturas de falhas ficam em `cypress/screenshots/`. Essas pastas e `node_modules/` são ignoradas pelo Git.

Para acompanhar uma execução completa com a janela do Edge visível, use `npm run cy:run -- --headed`.

Para conferir a instalação e o binário:

```bash
npx cypress version
npx cypress verify
```

Os resultados dependem de uma execução real e da disponibilidade do site externo. Consulte a saída da execução para identificar eventuais falhas.

## Resultado da validação

Em **18/11/2026**, os sete testes foram executados no **Microsoft Edge 157**, com **Cypress 16.3.0** e **Node.js 24.15.0**, usando `npm.cmd run cy:run -- --headed`.

| Teste | Resultado no Edge |
| --- | --- |
| 01 - Login válido | Passou |
| 02 - Login inválido | Passou |
| 03 - Adicionar produtos ao carrinho | Passou |
| 04 - Remover produto do carrinho | Passou |
| 05 - Finalizar uma compra | Passou |
| 06 - Ordenação de produtos | Passou |
| 07 - Logout | Passou |

**Total: 7 aprovados, 0 reprovados e 0 ignorados**, em aproximadamente 8 segundos. O registro dessa execução está em [cypress-run.log](cypress-run.log) e a gravação está em [cypress/videos/saucedemo.cy.js.mp4](cypress/videos/saucedemo.cy.js.mp4). Novas execuções podem substituir essas evidências locais, que são ignoradas pelo Git.

A verificação do binário com `cypress verify` também passou. A instalação informou zero vulnerabilidades no momento da validação.

No ambiente de execução do assistente, a variável `ELECTRON_RUN_AS_NODE` fazia o Cypress apresentar `bad option: --smoke-test`. Ela foi removida somente do processo usado para executar o Cypress. Caso o mesmo erro apareça no PowerShell, execute `Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue` antes dos comandos do projeto. Não houve alteração de variáveis globais ou da política de execução.

## Comandos utilizados

| Comando | Uso no projeto |
| --- | --- |
| `describe()` e `it()` | Agrupam a suíte e identificam cada cenário em português. |
| `beforeEach()` | Abre a página inicial antes de cada teste. |
| `cy.visit()` | Acessa uma página usando a URL base configurada. |
| `cy.get()` | Localiza elementos, preferencialmente por `data-test`. |
| `.type()` | Preenche os campos de login e checkout. |
| `.click()` | Aciona botões e links. |
| `cy.contains()` | Localiza os produtos pelo texto exibido. |
| `.should()` e `.and()` | Verificam texto, visibilidade, quantidade e outros resultados, com repetição automática até o limite do Cypress. |
| `cy.url()` | Obtém a URL atual para verificar a navegação. |
| `.select()` | Escolhe a opção `lohi`, que representa preço crescente. |
| `Cypress.Commands.add()` e `cy.login()` | Definem e reutilizam um login simples pela interface. |
| `Cypress.config()` | Obtém a URL base para verificar o retorno ao login. |
| `expect()` | Verifica os preços convertidos para números e compara a ordem exibida com uma cópia ordenada. |

Na ordenação, `Array.from()` obtém os textos dos preços e `Number()` os converte para números. A comparação utiliza `.sort((a, b) => a - b)`, evitando a ordenação alfabética de valores. A verificação fica dentro de `.should()` para acompanhar a atualização da página.

Não há esperas fixas, mocks ou interceptações. O botão que abre o menu lateral é localizado pelo ID `react-burger-menu-btn`, pois não possui `data-test`.

## Referências

- Materiais fornecidos: Aula 14 sobre Cypress e atividade prática de testes automatizados no SauceDemo.
- [Instalação do Cypress](https://docs.cypress.io/app/get-started/install-cypress).
- [Configuração do Cypress](https://docs.cypress.io/app/references/configuration).
