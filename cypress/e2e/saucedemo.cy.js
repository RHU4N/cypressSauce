describe('SauceDemo - Testes E2E da loja virtual', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Teste 01 - Login válido', () => {
    cy.login();

    cy.get('[data-test="title"]').should('have.text', 'Products');
    cy.get('[data-test="inventory-list"]').should('be.visible');
    cy.get('[data-test="inventory-item"]').should('have.length', 6);
  });

  it('Teste 02 - Login inválido', () => {
    cy.get('[data-test="username"]').type('usuario_invalido');
    cy.get('[data-test="password"]').type('senha_incorreta');
    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username and password do not match any user in this service');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.get('[data-test="login-button"]').should('be.visible');
  });

  it('Teste 03 - Adicionar produtos ao carrinho', () => {
    cy.login();
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '2');
    cy.get('[data-test="shopping-cart-link"]').click();

    cy.url().should('include', '/cart.html');
    cy.get('[data-test="inventory-item"]').should('have.length', 2);
    cy.contains('[data-test="inventory-item-name"]', 'Sauce Labs Backpack')
      .should('be.visible');
    cy.contains('[data-test="inventory-item-name"]', 'Sauce Labs Bike Light')
      .should('be.visible');
  });

  it('Teste 04 - Remover produto do carrinho', () => {
    cy.login();
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="inventory-item"]').should('have.length', 2);
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();

    cy.get('[data-test="inventory-item"]').should('have.length', 1);
    cy.get('[data-test="inventory-item-name"]')
      .should('have.text', 'Sauce Labs Bike Light');
    cy.contains('[data-test="inventory-item-name"]', 'Sauce Labs Backpack')
      .should('not.exist');
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');
  });

  it('Teste 05 - Finalizar uma compra', () => {
    cy.login();
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();
    cy.url().should('include', '/checkout-step-one.html');
    cy.get('[data-test="firstName"]').type('Pessoa');
    cy.get('[data-test="lastName"]').type('Ficticia');
    cy.get('[data-test="postalCode"]').type('00000-000');
    cy.get('[data-test="continue"]').click();

    cy.url().should('include', '/checkout-step-two.html');
    cy.get('[data-test="inventory-item-name"]')
      .should('have.text', 'Sauce Labs Backpack');
    cy.get('[data-test="finish"]').click();

    cy.url().should('include', '/checkout-complete.html');
    cy.get('[data-test="complete-header"]')
      .should('be.visible')
      .and('have.text', 'Thank you for your order!');
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  it('Teste 06 - Ordenação de produtos', () => {
    cy.login();
    cy.get('[data-test="product-sort-container"]').select('lohi');
    cy.get('[data-test="product-sort-container"]').should('have.value', 'lohi');

    cy.get('[data-test="inventory-item-price"]').should(($precos) => {
      const precos = Array.from($precos, (elemento) =>
        Number(elemento.innerText.replace('$', '').trim())
      );

      expect(precos, 'preços de todos os produtos').to.have.length(6);
      precos.forEach((preco) => {
        expect(Number.isFinite(preco), 'preço numérico válido').to.eq(true);
      });

      // Uma cópia evita alterar a lista original ao ordenar numericamente.
      const precosOrdenados = [...precos].sort((a, b) => a - b);
      expect(precos, 'preços do menor para o maior').to.deep.equal(precosOrdenados);
    });
  });

  it('Teste 07 - Logout', () => {
    cy.login();
    // O botão de abrir o menu não possui atributo data-test.
    cy.get('#react-burger-menu-btn').click();
    cy.get('[data-test="logout-sidebar-link"]').should('be.visible').click();

    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.get('[data-test="username"]').should('be.visible').and('have.value', '');
    cy.get('[data-test="password"]').should('be.visible').and('have.value', '');
    cy.get('[data-test="login-button"]').should('be.visible');
  });
});
