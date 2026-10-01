import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Produto } from '../model/Produto';

interface ContaLocal {
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  salt: string;
  senhaHash: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="topbar">
      <div class="brand" (click)="voltarHome()" style="cursor: pointer;">
        <span class="brand-mark">P</span>
        <span>PlayShop</span>
      </div>

      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="textoBusca"
          placeholder="Buscar produtos..."
          aria-label="Buscar produtos"
        />
        <button type="button" (click)="voltarHome()">Buscar</button>
      </div>

      <div class="topbar-actions">
        <nav class="nav">
          <button type="button" (click)="voltarHome()">Home</button>
          <button type="button" (click)="currentView = 'home'">Produtos</button>
          <button type="button" (click)="currentView = 'carrinho'">Cesta</button>
          <button type="button" (click)="currentView = 'login'">Login</button>
        </nav>

        <button class="cart-button" type="button" (click)="currentView = 'carrinho'">
          Carrinho ({{ totalItensCarrinho }})
        </button>
      </div>
    </header>

    <main class="page">
      <p class="form-message success" role="status" *ngIf="mensagemCompra">{{ mensagemCompra }}</p>

      <section *ngIf="currentView === 'home'" class="home-view">
        <section class="hero">
          <div class="hero-text">
            <p class="tag">A melhor loja gamer</p>
            <h1>Mergulhe na diversão com os melhores jogos do mercado</h1>
            <p class="subtitle">
              Descubra títulos incríveis para PC, PlayStation, Xbox e Nintendo com ofertas exclusivas para você gamer.
            </p>
            <div class="hero-actions">
              <button class="primary" type="button" (click)="scrollToCatalog()">Comprar agora</button>
              <button class="secondary" type="button" (click)="currentView = 'login'">Entrar</button>
            </div>
          </div>

          <div class="hero-card">
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80"
              alt="Setup gamer"
              (error)="tratarErroImagem($event)"
            />
          </div>
        </section>

        <section class="features">
          <div class="feature-item">
            <span>⚡</span>
            <div>
              <strong>Entrega rápida</strong>
              <p>Seu jogo favorito chega em até 48h para a sua casa.</p>
            </div>
          </div>

          <div class="feature-item">
            <span>🛡️</span>
            <div>
              <strong>Compra segura</strong>
              <p>Pagamento protegido e suporte para sua compra.</p>
            </div>
          </div>

          <div class="feature-item">
            <span>🎮</span>
            <div>
              <strong>Catálogo premium</strong>
              <p>Jogos e lançamentos para todos os estilos de gamer.</p>
            </div>
          </div>
        </section>

        <section class="catalog" id="catalogo">
          <div class="section-title">
            <div>
              <p class="tag">Produtos em destaque</p>
              <h2>Mais vendidos</h2>
            </div>
            <span>{{ produtosFiltrados.length }} itens</span>
          </div>

          <div class="product-grid">
            <article class="product-card" *ngFor="let produto of produtosFiltrados">
              <div class="product-image">
                <img [src]="produto.imagem || imagemPadrao" [alt]="produto.nome" (error)="tratarErroImagem($event)" />
              </div>

              <div class="product-body">
                <span class="category">{{ produto.categoria }}</span>
                <h3>{{ produto.nome }}</h3>
                <p>{{ produto.descricao }}</p>

                <div class="product-meta">
                  <span>{{ produto.plataforma }}</span>
                  <span>{{ produto.estoque }} em estoque</span>
                </div>

                <div class="product-footer">
                  <strong>R$ {{ produto.preco.toFixed(2) }}</strong>
                  <div class="actions">
                    <button type="button" class="btn-detail" (click)="abrirDetalhe(produto)">Detalhes</button>
                    <button type="button" class="btn-buy" (click)="adicionarAoCarrinho(produto)">Comprar</button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>

      <section *ngIf="currentView === 'detalhe' && produtoSelecionado" class="detail-view">
        <button class="back-link" type="button" (click)="voltarHome()">← Voltar</button>

        <div class="detail-grid">
          <div class="detail-image-wrap">
            <img [src]="produtoSelecionado.imagem || imagemPadrao" [alt]="produtoSelecionado.nome" (error)="tratarErroImagem($event)" />
          </div>

          <div class="detail-info">
            <span class="category">{{ produtoSelecionado.categoria }}</span>
            <h2>{{ produtoSelecionado.nome }}</h2>
            <p class="detail-price">R$ {{ produtoSelecionado.preco.toFixed(2) }}</p>
            <p class="detail-description">{{ produtoSelecionado.descricao }}</p>

            <div class="detail-meta">
              <span>Plataforma: {{ produtoSelecionado.plataforma }}</span>
              <span>Estoque: {{ produtoSelecionado.estoque }}</span>
            </div>

            <div class="detail-actions">
              <button type="button" class="primary" (click)="adicionarAoCarrinho(produtoSelecionado)">Adicionar ao carrinho</button>
              <button type="button" class="secondary" (click)="voltarHome()">Continuar comprando</button>
            </div>
          </div>
        </div>
      </section>

      <section *ngIf="currentView === 'carrinho'" class="cart-view">
        <div class="section-title">
          <div>
            <p class="tag">Sua cesta</p>
            <h2>Produtos selecionados</h2>
          </div>
        </div>

        <div *ngIf="carrinho.length === 0" class="empty-cart">
          <p>Sua cesta está vazia no momento.</p>
          <button type="button" class="primary" (click)="voltarHome()">Ir para loja</button>
        </div>

        <div *ngIf="carrinho.length > 0 && !checkoutIniciado" class="cart-layout">
          <div class="cart-list">
            <div class="cart-item" *ngFor="let item of carrinho; let i = index">
              <img [src]="item.produto.imagem || imagemPadrao" [alt]="item.produto.nome" (error)="tratarErroImagem($event)" />
              <div class="cart-item-info">
                <h3>{{ item.produto.nome }}</h3>
                <p>{{ item.produto.categoria }}</p>
                <strong>R$ {{ item.produto.preco.toFixed(2) }}</strong>
              </div>

              <div class="quantity-box">
                <button type="button" (click)="alterarQuantidade(i, -1)">-</button>
                <span>{{ item.quantidade }}</span>
                <button type="button" (click)="alterarQuantidade(i, 1)">+</button>
              </div>

              <button type="button" class="remove-button" (click)="removerDoCarrinho(i)">Remover</button>
            </div>
          </div>

          <aside class="summary-box">
            <h3>Resumo</h3>
            <div class="summary-row">
              <span>Subtotal</span>
              <strong>R$ {{ totalCarrinho.toFixed(2) }}</strong>
            </div>
            <div class="summary-row">
              <span>Frete</span>
              <strong>Grátis</strong>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <strong>R$ {{ totalCarrinho.toFixed(2) }}</strong>
            </div>
            <button type="button" class="primary full" (click)="iniciarCheckout()">Continuar para endereço</button>
            <p class="form-message success" *ngIf="mensagemCompra">{{ mensagemCompra }}</p>
          </aside>
        </div>

        <div *ngIf="carrinho.length > 0 && checkoutIniciado" class="cart-layout">
          <form #enderecoForm="ngForm" (ngSubmit)="finalizarCompra(enderecoForm)" class="auth-card" novalidate>
            <p class="tag">Entrega</p>
            <h2>Endereço de entrega</h2>

            <div class="field">
              <label for="cepEntrega">CEP</label>
              <input id="cepEntrega" name="cep" type="text" [(ngModel)]="enderecoEntrega.cep" required pattern="[0-9]{5}-?[0-9]{3}" maxlength="9" inputmode="numeric" autocomplete="postal-code" placeholder="00000-000" />
              <small *ngIf="enderecoForm.submitted && enderecoForm.controls['cep']?.invalid">Informe um CEP válido.</small>
            </div>

            <div class="field">
              <label for="ruaEntrega">Rua</label>
              <input id="ruaEntrega" name="rua" type="text" [(ngModel)]="enderecoEntrega.rua" required autocomplete="address-line1" />
              <small *ngIf="enderecoForm.submitted && enderecoForm.controls['rua']?.invalid">Informe a rua.</small>
            </div>

            <div class="field">
              <label for="numeroEntrega">Número</label>
              <input id="numeroEntrega" name="numero" type="text" [(ngModel)]="enderecoEntrega.numero" required autocomplete="address-line2" />
              <small *ngIf="enderecoForm.submitted && enderecoForm.controls['numero']?.invalid">Informe o número.</small>
            </div>

            <div class="field">
              <label for="complementoEntrega">Complemento (opcional)</label>
              <input id="complementoEntrega" name="complemento" type="text" [(ngModel)]="enderecoEntrega.complemento" />
            </div>

            <div class="field">
              <label for="bairroEntrega">Bairro</label>
              <input id="bairroEntrega" name="bairro" type="text" [(ngModel)]="enderecoEntrega.bairro" required />
              <small *ngIf="enderecoForm.submitted && enderecoForm.controls['bairro']?.invalid">Informe o bairro.</small>
            </div>

            <div class="field">
              <label for="cidadeEntrega">Cidade</label>
              <input id="cidadeEntrega" name="cidade" type="text" [(ngModel)]="enderecoEntrega.cidade" required autocomplete="address-level2" />
              <small *ngIf="enderecoForm.submitted && enderecoForm.controls['cidade']?.invalid">Informe a cidade.</small>
            </div>

            <div class="field">
              <label for="estadoEntrega">Estado (UF)</label>
              <input id="estadoEntrega" name="estado" type="text" [(ngModel)]="enderecoEntrega.estado" required pattern="[A-Za-z]{2}" maxlength="2" autocomplete="address-level1" />
              <small *ngIf="enderecoForm.submitted && enderecoForm.controls['estado']?.invalid">Informe uma UF válida com 2 letras.</small>
            </div>

            <div class="detail-actions">
              <button type="button" class="secondary" (click)="checkoutIniciado = false">Voltar à cesta</button>
              <button type="submit" class="primary">Confirmar compra</button>
            </div>
          </form>

          <aside class="summary-box">
            <h3>Resumo do pedido</h3>
            <div class="summary-row">
              <span>{{ totalItensCarrinho }} item(ns)</span>
              <strong>R$ {{ totalCarrinho.toFixed(2) }}</strong>
            </div>
            <div class="summary-row">
              <span>Frete</span>
              <strong>Grátis</strong>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <strong>R$ {{ totalCarrinho.toFixed(2) }}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section *ngIf="currentView === 'login'" class="auth-view">
        <div class="auth-card">
          <p class="tag">Acesso do cliente</p>
          <h2>Login</h2>

          <form #loginForm="ngForm" (ngSubmit)="login(loginForm)" novalidate>
            <div class="field">
              <label for="email">E-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                [(ngModel)]="usuario.email"
                required
                email
                placeholder="seuemail@email.com"
              />
              <small *ngIf="loginForm.submitted && loginForm.controls['email']?.invalid">Informe um e-mail válido.</small>
            </div>

            <div class="field">
              <label for="senha">Senha</label>
              <input
                id="senha"
                type="password"
                name="senha"
                [(ngModel)]="usuario.senha"
                required
                minlength="6"
                placeholder="********"
              />
              <small *ngIf="loginForm.submitted && loginForm.controls['senha']?.invalid">A senha deve ter pelo menos 6 caracteres.</small>
            </div>

            <p class="form-message" *ngIf="mensagemLogin">{{ mensagemLogin }}</p>

            <button type="submit" class="primary full">Entrar</button>

            <div class="auth-links">
              <button type="button" class="link-button" (click)="mensagemCadastro = ''; currentView = 'cadastro'">Criar uma conta</button>
              <button type="button" class="link-button" (click)="currentView = 'forgot'">Esqueci minha senha</button>
              <button type="button" class="link-button" (click)="voltarHome()">Voltar para loja</button>
            </div>
          </form>
        </div>
      </section>

      <section *ngIf="currentView === 'cadastro'" class="auth-view">
        <div class="auth-card">
          <p class="tag">Acesso do cliente</p>
          <h2>Criar conta</h2>

          <form #cadastroForm="ngForm" (ngSubmit)="cadastrar(cadastroForm)" novalidate>
            <div class="field">
              <label for="nomeCadastro">Nome</label>
              <input
                id="nomeCadastro"
                type="text"
                name="nomeCadastro"
                [(ngModel)]="novoUsuario.nome"
                required
                minlength="2"
                placeholder="Seu nome"
              />
              <small *ngIf="cadastroForm.submitted && cadastroForm.controls['nomeCadastro']?.invalid">Informe seu nome.</small>
            </div>

            <div class="field">
              <label for="emailCadastro">E-mail</label>
              <input
                id="emailCadastro"
                type="email"
                name="emailCadastro"
                [(ngModel)]="novoUsuario.email"
                required
                email
                placeholder="seuemail@email.com"
              />
              <small *ngIf="cadastroForm.submitted && cadastroForm.controls['emailCadastro']?.invalid">Informe um e-mail válido.</small>
            </div>

            <div class="field">
              <label for="cpfCadastro">CPF</label>
              <input
                id="cpfCadastro"
                type="text"
                name="cpfCadastro"
                [(ngModel)]="novoUsuario.cpf"
                required
                pattern="[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9]{2}"
                inputmode="numeric"
                maxlength="14"
                placeholder="000.000.000-00"
              />
              <small *ngIf="cadastroForm.submitted && cadastroForm.controls['cpfCadastro']?.invalid">Informe os 11 dígitos do CPF.</small>
            </div>

            <div class="field">
              <label for="telefoneCadastro">Telefone</label>
              <input
                id="telefoneCadastro"
                type="tel"
                name="telefoneCadastro"
                [(ngModel)]="novoUsuario.telefone"
                (ngModelChange)="formatarTelefone($event)"
                required
                inputmode="numeric"
                maxlength="16"
                placeholder="(11) 123456-7890"
              />
              <small *ngIf="cadastroForm.submitted && !telefoneValido">Use o formato (11) 123456-7890.</small>
            </div>

            <div class="field">
              <label for="senhaCadastro">Senha</label>
              <input
                id="senhaCadastro"
                type="password"
                name="senhaCadastro"
                [(ngModel)]="novoUsuario.senha"
                required
                minlength="6"
                placeholder="Mínimo de 6 caracteres"
              />
              <small *ngIf="cadastroForm.submitted && cadastroForm.controls['senhaCadastro']?.invalid">A senha deve ter pelo menos 6 caracteres.</small>
            </div>

            <div class="field">
              <label for="confirmarSenha">Confirmar senha</label>
              <input
                id="confirmarSenha"
                type="password"
                name="confirmarSenha"
                [(ngModel)]="novoUsuario.confirmarSenha"
                required
                minlength="6"
                placeholder="Digite a senha novamente"
              />
              <small *ngIf="cadastroForm.submitted && cadastroForm.controls['confirmarSenha']?.invalid">Confirme sua senha.</small>
            </div>

            <p class="form-message" *ngIf="mensagemCadastro">{{ mensagemCadastro }}</p>

            <button type="submit" class="primary full">Cadastrar</button>

            <div class="auth-links">
              <button type="button" class="link-button" (click)="currentView = 'login'">Já tenho uma conta</button>
              <button type="button" class="link-button" (click)="voltarHome()">Voltar para loja</button>
            </div>
          </form>
        </div>
      </section>

      <section *ngIf="currentView === 'forgot'" class="auth-view">
        <div class="auth-card">
          <p class="tag">Recuperação</p>
          <h2>Esqueci minha senha</h2>

          <form #forgotForm="ngForm" (ngSubmit)="recuperarSenha(forgotForm)" novalidate>
            <div class="field">
              <label for="recuperarEmail">E-mail</label>
              <input
                id="recuperarEmail"
                type="email"
                name="recuperarEmail"
                [(ngModel)]="emailRecuperacao"
                required
                email
                placeholder="seuemail@email.com"
              />
              <small *ngIf="forgotForm.submitted && forgotForm.controls['recuperarEmail']?.invalid">Informe um e-mail válido.</small>
            </div>

            <p class="form-message success" *ngIf="mensagemRecuperacao">{{ mensagemRecuperacao }}</p>

            <button type="submit" class="primary full">Enviar link</button>

            <div class="auth-links">
              <button type="button" class="link-button" (click)="currentView = 'login'">Voltar ao login</button>
            </div>
          </form>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>© {{ anoAtual }} PlayShop. Todos os direitos reservados.</p>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: linear-gradient(180deg, #0b1020 0%, #111827 100%);
        color: #e5eefb;
        font-family: Arial, sans-serif;
      }

      a,
      button,
      input {
        font: inherit;
      }

      button {
        border: none;
      }

      .topbar {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.5rem;
        font-weight: 700;
      }

      .brand-mark {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #7c3aed, #22c55e);
        color: white;
        font-weight: 800;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .search-box {
        flex: 1;
        max-width: 420px;
        display: flex;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 999px;
        overflow: hidden;
        transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
      }

      .search-box input {
        flex: 1;
        background: transparent;
        border: none;
        color: white;
        padding: 12px 16px;
        outline: none;
      }

      .search-box button,
      .nav button,
      .cart-button,
      .primary,
      .secondary,
      .btn-buy,
      .btn-detail,
      .remove-button,
      .link-button {
        border-radius: 999px;
      }

      .search-box button {
        background: linear-gradient(135deg, #7c3aed, #22c55e);
        color: white;
        padding: 0 18px;
      }

      .nav {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .nav button {
        background: transparent;
        color: #dbeafe;
        padding: 10px 14px;
      }

      .nav button:hover,
      .link-button:hover,
      .btn-detail:hover,
      .secondary:hover,
      .primary:hover,
      .remove-button:hover,
      .cart-button:hover {
        opacity: 0.95;
        transform: translateY(-1px);
      }

      .primary:hover,
      .btn-buy:hover,
      .search-box button:hover {
        box-shadow: 0 10px 26px rgba(124, 58, 237, 0.28);
        transform: translateY(-2px);
      }

      .primary:active,
      .secondary:active,
      .btn-buy:active,
      .btn-detail:active,
      .cart-button:active {
        transform: translateY(0) scale(0.98);
      }

      .cart-button {
        background: #f8fafc;
        color: #111827;
        padding: 12px 18px;
        font-weight: 700;
      }

      .page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
      }

      .hero {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        align-items: center;
        gap: 36px;
        padding: 40px 0 24px;
        animation: view-in 0.65s ease both;
      }

      .tag {
        color: #86efac;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.76rem;
      }

      .hero-text h1 {
        font-size: clamp(2.5rem, 4vw, 4.5rem);
        line-height: 1.05;
        margin: 12px 0;
        animation: rise-in 0.65s 0.08s ease both;
      }

      .subtitle {
        color: #cbd5e1;
        font-size: 1.05rem;
        max-width: 600px;
        line-height: 1.7;
        animation: rise-in 0.65s 0.16s ease both;
      }

      .hero-actions {
        display: flex;
        gap: 16px;
        margin-top: 24px;
        flex-wrap: wrap;
        animation: rise-in 0.65s 0.24s ease both;
      }

      .primary,
      .secondary,
      .btn-buy,
      .btn-detail,
      .link-button {
        padding: 12px 20px;
        font-weight: 700;
      }

      .primary,
      .btn-buy {
        background: linear-gradient(135deg, #7c3aed, #22c55e);
        color: white;
      }

      .secondary,
      .btn-detail,
      .link-button {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
      }

      .hero-card {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 28px;
        overflow: hidden;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
        animation: hero-float 6s ease-in-out 0.7s infinite;
      }

      .hero-card img {
        display: block;
        width: 100%;
        height: 440px;
        object-fit: cover;
        transition: transform 0.7s ease;
      }

      .hero-card:hover img {
        transform: scale(1.04);
      }

      .features {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
        padding: 30px 0 10px;
      }

      .feature-item {
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 18px;
        padding: 18px 20px;
        display: flex;
        gap: 14px;
        align-items: flex-start;
        transition: transform 0.28s ease, border-color 0.28s ease, background 0.28s ease;
      }

      .feature-item:hover {
        transform: translateY(-4px);
        border-color: rgba(134, 239, 172, 0.36);
        background: rgba(17, 30, 52, 0.9);
      }

      .feature-item span {
        font-size: 1.6rem;
      }

      .feature-item strong {
        display: block;
        margin-bottom: 6px;
      }

      .feature-item p {
        margin: 0;
        color: #cbd5e1;
        line-height: 1.5;
      }

      .catalog,
      .detail-view,
      .cart-view,
      .auth-view {
        padding-top: 42px;
        animation: view-in 0.42s ease both;
      }

      .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
        gap: 16px;
      }

      .section-title h2,
      .auth-card h2,
      .detail-info h2 {
        margin: 8px 0 0;
        font-size: 2rem;
      }

      .catalog {
        background: rgba(15, 23, 42, 0.24);
        border: 1px solid rgba(148, 163, 184, 0.12);
        border-radius: 28px;
        padding: 24px;
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 24px;
      }

      .product-card {
        background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(17, 24, 39, 0.8));
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        animation: card-in 0.5s ease both;
      }

      .product-card:hover {
        transform: translateY(-4px);
        border-color: rgba(134, 239, 172, 0.35);
        box-shadow: 0 22px 50px rgba(124, 58, 237, 0.2);
      }

      .product-image img {
        display: block;
        width: 100%;
        height: 220px;
        object-fit: cover;
        transition: transform 0.55s ease, filter 0.55s ease;
      }

      .product-card:hover .product-image img {
        transform: scale(1.06);
        filter: saturate(1.12);
      }

      .product-body {
        padding: 18px;
      }

      .category {
        display: inline-block;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(124, 58, 237, 0.18);
        color: #c4b5fd;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .product-body h3 {
        margin: 14px 0 8px;
        font-size: 1.35rem;
      }

      .product-body p {
        margin: 0;
        color: #cbd5e1;
        line-height: 1.6;
        min-height: 72px;
      }

      .product-meta {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        color: #94a3b8;
        font-size: 0.82rem;
      }

      .product-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 18px;
        gap: 12px;
      }

      .product-footer strong {
        font-size: 1.35rem;
        color: #f8fafc;
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      .btn-detail,
      .btn-buy {
        padding: 8px 12px;
        font-size: 0.8rem;
      }

      .detail-grid,
      .cart-layout {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 28px;
        align-items: center;
      }

      .detail-image-wrap,
      .summary-box,
      .auth-card {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 20px;
        padding: 20px;
      }

      .detail-image-wrap img {
        width: 100%;
        height: 420px;
        object-fit: cover;
        border-radius: 18px;
      }

      .detail-info {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .detail-price {
        font-size: 2rem;
        font-weight: 700;
        color: #f8fafc;
        margin: 0;
      }

      .detail-description {
        color: #cbd5e1;
        line-height: 1.7;
      }

      .detail-meta {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: #cbd5e1;
        font-size: 0.9rem;
        flex-wrap: wrap;
      }

      .detail-actions,
      .auth-links {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .full {
        width: 100%;
      }

      .back-link {
        background: transparent;
        color: #93c5fd;
        font-weight: 700;
        margin-bottom: 16px;
      }

      .cart-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .cart-item {
        display: grid;
        grid-template-columns: 110px 1fr auto auto;
        align-items: center;
        gap: 16px;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 18px;
        padding: 16px;
      }

      .cart-item img {
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: 12px;
      }

      .cart-item-info h3 {
        margin: 0 0 6px;
      }

      .cart-item-info p,
      .cart-item-info strong {
        margin: 0;
        color: #cbd5e1;
      }

      .quantity-box {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(148, 163, 184, 0.1);
        border-radius: 999px;
        padding: 8px 12px;
      }

      .quantity-box button {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #f8fafc;
        color: #111827;
        font-weight: 700;
        transition: transform 0.2s ease, background 0.2s ease;
      }

      .remove-button {
        background: #ef4444;
        color: white;
        padding: 10px 12px;
      }

      .summary-box {
        align-self: start;
      }

      .summary-box h3 {
        margin-top: 0;
        font-size: 1.5rem;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        color: #dbeafe;
      }

      .summary-row.total {
        font-size: 1.15rem;
        font-weight: 700;
      }

      .empty-cart {
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 16px;
        padding: 30px;
        text-align: center;
      }

      .auth-card {
        max-width: 500px;
        margin: 0 auto;
        animation: card-in 0.5s ease both;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 18px;
      }

      .field label {
        font-weight: 700;
      }

      .field input {
        width: 100%;
        padding: 12px 14px;
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: rgba(15, 23, 42, 0.55);
        color: white;
      }

      .field small,
      .form-message {
        color: #fca5a5;
      }

      .form-message.success {
        color: #86efac;
      }

      .auth-links {
        margin-top: 18px;
      }

      @media (max-width: 900px) {
        .hero,
        .detail-grid,
        .cart-layout,
        .features,
        .product-grid {
          grid-template-columns: 1fr;
        }

        .nav {
          width: 100%;
          justify-content: center;
        }

        .search-box {
          width: 100%;
          max-width: 100%;
        }
      }

      @media (max-width: 600px) {
        .topbar,
        .page {
          padding-left: 16px;
          padding-right: 16px;
        }

        .cart-item {
          grid-template-columns: 1fr;
          justify-items: start;
        }

        .product-footer {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class AppComponent {
  currentView: 'home' | 'login' | 'cadastro' | 'forgot' | 'detalhe' | 'carrinho' = 'home';
  anoAtual = new Date().getFullYear();
  private readonly cartStorageKey = 'playshop:cart';
  private readonly userEmailStorageKey = 'playshop:user-email';
  private readonly usersStorageKey = 'playshop:users';
  textoBusca = '';
  imagemPadrao = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80';
  usuario = {
    email: '',
    senha: '',
  };
  novoUsuario = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  };
  emailRecuperacao = '';
  mensagemLogin = '';
  mensagemCadastro = '';
  mensagemRecuperacao = '';
  mensagemCompra = '';
  checkoutIniciado = false;
  enderecoEntrega = {
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  };
  produtoSelecionado: Produto | null = null;

  produtos: Produto[] = [
    {
      id: 1,
      nome: 'God of War Ragnarök',
      descricao: 'Uma jornada épica com ação intensa, narrativa envolvente e desafios grandiosos.',
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/coba3d.webp',
      categoria: 'Ação',
      plataforma: 'PS5',
      preco: 249.9,
      estoque: 12,
    },
    {
      id: 2,
      nome: 'FIFA 25',
      descricao: 'Experimente partidas realistas, times icônicos e uma temporada repleta de emoção.',
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/coa755.webp',
      categoria: 'Esporte',
      plataforma: 'PC',
      preco: 199.9,
      estoque: 25,
    },
    {
      id: 3,
      nome: 'Cyberpunk 2077',
      descricao: 'Explore um mundo futurista cheio de missões, escolhas e uma história envolvente.',
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/coaih8.webp',
      categoria: 'RPG',
      plataforma: 'Xbox',
      preco: 179.9,
      estoque: 18,
    },
    {
      id: 4,
      nome: 'Zelda: Tears of the Kingdom',
      descricao: 'Uma aventura magnífica com exploração, quebra-cabeças e mundo aberto impressionante.',
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.webp',
      categoria: 'Aventura',
      plataforma: 'Nintendo',
      preco: 289.9,
      estoque: 9,
    },
    {
      id: 5,
      nome: 'Fortnite',
      descricao: 'Battle royale dinâmico, em constante atualização e cheio de eventos especiais.',
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/cocxbi.webp',
      categoria: 'Battle Royale',
      plataforma: 'Multiplataforma',
      preco: 149.9,
      estoque: 31,
    },
    {
      id: 6,
      nome: 'Minecraft',
      descricao: 'Crie, construa e sobreviva em um mundo virtual infinitamente criativo.',
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8fu7.webp',
      categoria: 'Sobrevivência',
      plataforma: 'PC',
      preco: 99.9,
      estoque: 14,
    },
    {
      id: 7,
      nome: 'Elden Ring',
      descricao: 'Um mundo desafiador, repleto de mistérios, bosses gigantes e exploração fascinante.',
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.png',
      categoria: 'RPG',
      plataforma: 'PC',
      preco: 259.9,
      estoque: 10,
    },
    {
      id: 8,
      nome: 'The Last of Us Part II',
      descricao: 'Uma experiência intensa de narrativa, sobrevivência e escolhas emocionais.',
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5ziw.webp',
      categoria: 'Aventura',
      plataforma: 'PS5',
      preco: 219.9,
      estoque: 11,
    },
    {
      id: 9,
      nome: 'Halo Infinite',
      descricao: 'Combate inimigos em um universo épico com gráficos impressionantes e ação intensa.',
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2dto.webp',
      categoria: 'FPS',
      plataforma: 'Xbox',
      preco: 199.9,
      estoque: 20,
    },
  ];

  carrinho: Array<{ produto: Produto; quantidade: number }> = [];

  constructor(private readonly changeDetector: ChangeDetectorRef) {
    this.carregarDadosLocais();
  }

  get totalItensCarrinho(): number {
    return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
  }

  get produtosFiltrados(): Produto[] {
    return this.produtos.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(this.textoBusca.toLowerCase()) ||
        produto.categoria.toLowerCase().includes(this.textoBusca.toLowerCase()) ||
        produto.plataforma.toLowerCase().includes(this.textoBusca.toLowerCase()),
    );
  }

  get totalCarrinho(): number {
    return this.carrinho.reduce((total, item) => total + item.produto.preco * item.quantidade, 0);
  }

  get telefoneValido(): boolean {
    return /^\(\d{2}\) \d{6}-\d{4}$/.test(this.novoUsuario.telefone);
  }

  private obterLocalStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }

  private carregarDadosLocais(): void {
    const armazenamento = this.obterLocalStorage();
    if (!armazenamento) {
      return;
    }

    try {
      this.usuario.email = armazenamento.getItem(this.userEmailStorageKey) ?? '';
      const dadosSalvos: unknown = JSON.parse(armazenamento.getItem(this.cartStorageKey) ?? '[]');
      if (!Array.isArray(dadosSalvos)) {
        return;
      }

      this.carrinho = dadosSalvos.flatMap((dado: unknown) => {
        if (typeof dado !== 'object' || dado === null) {
          return [];
        }

        const itemSalvo = dado as { produtoId?: unknown; quantidade?: unknown };
        if (
          typeof itemSalvo.produtoId !== 'number' ||
          typeof itemSalvo.quantidade !== 'number' ||
          !Number.isInteger(itemSalvo.quantidade) ||
          itemSalvo.quantidade < 1
        ) {
          return [];
        }

        const produto = this.produtos.find((item) => item.id === itemSalvo.produtoId);
        return produto ? [{ produto, quantidade: itemSalvo.quantidade }] : [];
      });
    } catch (error) {
      console.warn('Não foi possível carregar os dados salvos no navegador.', error);
    }
  }

  private salvarCarrinho(): void {
    const armazenamento = this.obterLocalStorage();
    if (!armazenamento) {
      return;
    }

    const dados = this.carrinho.map(({ produto, quantidade }) => ({ produtoId: produto.id, quantidade }));
    try {
      armazenamento.setItem(this.cartStorageKey, JSON.stringify(dados));
    } catch (error) {
      console.warn('Não foi possível salvar o carrinho no navegador.', error);
    }
  }

  private salvarEmailUsuario(): void {
    const armazenamento = this.obterLocalStorage();
    if (!armazenamento) {
      return;
    }

    try {
      armazenamento.setItem(this.userEmailStorageKey, this.usuario.email.trim());
    } catch (error) {
      console.warn('Não foi possível salvar o e-mail no navegador.', error);
    }
  }

  private obterContasLocais(): ContaLocal[] {
    const armazenamento = this.obterLocalStorage();
    if (!armazenamento) {
      return [];
    }

    try {
      const contas: unknown = JSON.parse(armazenamento.getItem(this.usersStorageKey) ?? '[]');
      if (!Array.isArray(contas)) {
        return [];
      }

      return contas.filter(
        (conta: unknown): conta is ContaLocal =>
          typeof conta === 'object' &&
          conta !== null &&
          typeof (conta as ContaLocal).nome === 'string' &&
          typeof (conta as ContaLocal).email === 'string' &&
          typeof (conta as ContaLocal).salt === 'string' &&
          typeof (conta as ContaLocal).senhaHash === 'string',
      );
    } catch {
      return [];
    }
  }

  private criarSalt(): string {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  private async gerarHashSenha(senha: string, saltHex: string): Promise<string> {
    const salt = new Uint8Array(saltHex.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);
    const material = await globalThis.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(senha),
      'PBKDF2',
      false,
      ['deriveBits'],
    );
    const hash = await globalThis.crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 120_000, hash: 'SHA-256' },
      material,
      256,
    );
    return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  formatarTelefone(valor: string): void {
    const digitos = valor.replace(/\D/g, '').slice(0, 12);
    if (digitos.length <= 2) {
      this.novoUsuario.telefone = digitos ? `(${digitos}` : '';
      return;
    }

    const ddd = digitos.slice(0, 2);
    const numero = digitos.slice(2);
    this.novoUsuario.telefone = `(${ddd}) ${numero.slice(0, 6)}${numero.length > 6 ? `-${numero.slice(6)}` : ''}`;
  }

  async cadastrar(form: { submitted: boolean; controls: Record<string, { invalid: boolean }> }): Promise<void> {
    if (form.submitted && Object.values(form.controls).some((controle) => controle.invalid)) {
      this.mensagemCadastro = 'Confira os campos obrigatórios.';
      return;
    }

    const nome = this.novoUsuario.nome.trim();
    const email = this.novoUsuario.email.trim().toLowerCase();
    if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.mensagemCadastro = 'Informe seu nome e um e-mail válido.';
      return;
    }

    const cpf = this.novoUsuario.cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
      this.mensagemCadastro = 'Informe os 11 dígitos do CPF.';
      return;
    }

    const telefone = this.novoUsuario.telefone.trim();
    if (!/^\(\d{2}\) \d{6}-\d{4}$/.test(telefone)) {
      this.mensagemCadastro = 'Use o formato (11) 123456-7890 para o telefone.';
      return;
    }

    if (this.novoUsuario.senha.length < 6) {
      this.mensagemCadastro = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    if (this.novoUsuario.senha !== this.novoUsuario.confirmarSenha) {
      this.mensagemCadastro = 'As senhas não coincidem.';
      return;
    }

    const armazenamento = this.obterLocalStorage();
    if (!armazenamento || !globalThis.crypto?.subtle) {
      this.mensagemCadastro = 'Não foi possível criar a conta neste navegador.';
      return;
    }

    const contas = this.obterContasLocais();
    if (contas.some((conta) => conta.email.toLowerCase() === email)) {
      this.mensagemCadastro = 'Já existe uma conta com esse e-mail.';
      return;
    }

    try {
      const salt = this.criarSalt();
      const senhaHash = await this.gerarHashSenha(this.novoUsuario.senha, salt);
      contas.push({ nome, email, cpf, telefone, salt, senhaHash });
      armazenamento.setItem(this.usersStorageKey, JSON.stringify(contas));
      this.usuario.email = email;
      this.usuario.senha = '';
      this.salvarEmailUsuario();
      this.novoUsuario = { nome: '', email: '', cpf: '', telefone: '', senha: '', confirmarSenha: '' };
      this.mensagemCadastro = '';
      this.mensagemLogin = 'Cadastro realizado. Entre com seu e-mail e senha.';
      this.currentView = 'login';
    } catch {
      this.mensagemCadastro = 'Não foi possível salvar a conta neste navegador.';
    } finally {
      this.changeDetector.detectChanges();
    }
  }

  tratarErroImagem(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.imagemPadrao;
      img.onerror = null;
    }
  }

  voltarHome(): void {
    this.currentView = 'home';
    this.produtoSelecionado = null;
    this.mensagemCompra = '';
  }

  scrollToCatalog(): void {
    this.currentView = 'home';
    setTimeout(() => {
      const catalogo = document.getElementById('catalogo');
      if (catalogo) {
        catalogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  abrirDetalhe(produto: Produto): void {
    this.produtoSelecionado = produto;
    this.currentView = 'detalhe';
  }

  adicionarAoCarrinho(produto: Produto): void {
    if (!produto || !produto.id) {
      return;
    }

    const item = this.carrinho.find((carrinhoItem) => carrinhoItem.produto.id === produto.id);

    if (item) {
      item.quantidade += 1;
    } else {
      this.carrinho = [...this.carrinho, { produto, quantidade: 1 }];
    }

    this.salvarCarrinho();
    this.currentView = 'carrinho';
    this.mensagemCompra = '';
  }

  alterarQuantidade(index: number, valor: number): void {
    const item = this.carrinho[index];
    if (!item) {
      return;
    }

    item.quantidade += valor;

    if (item.quantidade <= 0) {
      this.carrinho.splice(index, 1);
    }

    this.salvarCarrinho();
  }

  removerDoCarrinho(index: number): void {
    this.carrinho.splice(index, 1);
    this.salvarCarrinho();
  }

  iniciarCheckout(): void {
    this.checkoutIniciado = true;
    this.mensagemCompra = '';
  }

  finalizarCompra(form: NgForm): void {
    if (this.carrinho.length === 0) {
      this.mensagemCompra = 'Seu carrinho está vazio.';
      return;
    }

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.mensagemCompra = 'Compra finalizada! O pedido será enviado em breve.';
    this.carrinho = [];
    this.salvarCarrinho();
    this.checkoutIniciado = false;
    this.currentView = 'home';
  }

  async login(form: { submitted: boolean; controls: Record<string, { invalid: boolean }> }): Promise<void> {
    if (form.submitted && (!this.usuario.email || !this.usuario.senha)) {
      this.mensagemLogin = 'Preencha todos os campos antes de entrar.';
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.usuario.email);
    if (!emailValido) {
      this.mensagemLogin = 'Informe um e-mail válido.';
      return;
    }

    if (this.usuario.senha.length < 6) {
      this.mensagemLogin = 'A senha deve conter pelo menos 6 caracteres.';
      return;
    }

    const conta = this.obterContasLocais().find((item) => item.email.toLowerCase() === this.usuario.email.trim().toLowerCase());
    if (!conta) {
      this.mensagemLogin = 'Não encontramos uma conta com esse e-mail. Cadastre-se primeiro.';
      return;
    }

    try {
      const senhaHash = await this.gerarHashSenha(this.usuario.senha, conta.salt);
      if (senhaHash !== conta.senhaHash) {
        this.mensagemLogin = 'E-mail ou senha incorretos.';
        this.changeDetector.detectChanges();
        return;
      }
    } catch {
      this.mensagemLogin = 'Não foi possível validar a conta neste navegador.';
      this.changeDetector.detectChanges();
      return;
    }

    this.salvarEmailUsuario();
    this.mensagemLogin = 'Login realizado com sucesso!';
    this.changeDetector.detectChanges();
  }

  recuperarSenha(form: { submitted: boolean; controls: Record<string, { invalid: boolean }> }): void {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailRecuperacao);

    if (!emailValido) {
      this.mensagemRecuperacao = 'Informe um e-mail válido para recuperar a senha.';
      return;
    }

    this.mensagemRecuperacao = `Link de recuperação enviado para ${this.emailRecuperacao}.`;
  }
}
