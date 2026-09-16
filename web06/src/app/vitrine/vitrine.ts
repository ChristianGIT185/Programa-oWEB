import { Component } from '@angular/core';
import { Produto } from '../model/produto';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-vitrine',
  styleUrl: './vitrine.css',
  templateUrl: './vitrine.html',
})
export class Vitrine {
  lista: Produto[] = [
  {
    "codigo": 1,
    "nome": "Martelo de Unha 25mm",
    "descritivo": "Martelo com cabo de madeira e cabeça de aço, ideal para trabalhos gerais.",
    "quantidade": 25,
    "valor": 39.90,
    "promo": 29.00,
    "destaque": 1
  },
  {
    "codigo": 2,
    "nome": "Chave de Fenda 6x150mm",
    "descritivo": "Chave de fenda com ponta resistente e cabo ergonômico.",
    "quantidade": 40,
    "valor": 18.50,
    "promo": 0,
    "destaque": 0
  },
  {
    "codigo": 3,
    "nome": "Jogo de Chaves Allen",
    "descritivo": "Kit com 9 chaves Allen de diferentes medidas para manutenção e montagem.",
    "quantidade": 18,
    "valor": 32.90,
    "promo": 30.00,
    "destaque": 1
  },
  {
    "codigo": 4,
    "nome": "Fita Isolante 20m",
    "descritivo": "Fita isolante preta de alta aderência para instalações elétricas.",
    "quantidade": 75,
    "valor": 8.90,
    "promo": 0,
    "destaque": 0
  },
  {
    "codigo": 5,
    "nome": "Trena 5 Metros",
    "descritivo": "Trena compacta com trava, gancho metálico e fita graduada.",
    "quantidade": 0,
    "valor": 24.90,
    "promo": 22.00,
    "destaque": 1
  },
  {
    "codigo": 6,
    "nome": "Alicate Universal 8 Polegadas",
    "descritivo": "Alicate de aço temperado com cabo emborrachado para maior conforto.",
    "quantidade": 22,
    "valor": 45.90,
    "promo": 0,
    "destaque": 0
  },
  {
    "codigo": 7,
    "nome": "Parafuso Sextavado 6x50mm",
    "descritivo": "Parafuso metálico para fixações em madeira e estruturas diversas.",
    "quantidade": 500,
    "valor": 1.20,
    "promo": 0,
    "destaque": 0
  },
  {
    "codigo": 8,
    "nome": "Furadeira de Impacto 650W",
    "descritivo": "Furadeira elétrica de impacto com controle de velocidade e mandril de 13mm.",
    "quantidade": 10,
    "valor": 289.90,
    "promo": 250.00,
    "destaque": 1
  },
  {
    "codigo": 9,
    "nome": "Extensão Elétrica 10 Metros",
    "descritivo": "Extensão elétrica com cabo flexível e três tomadas para uso doméstico e profissional.",
    "quantidade": 20,
    "valor": 59.90,
    "promo": 0,
    "destaque": 0
  },
  {
    "codigo": 10,
    "nome": "Caixa de Ferramentas 17 Polegadas",
    "descritivo": "Caixa organizadora resistente com bandeja interna para ferramentas e acessórios.",
    "quantidade": 15,
    "valor": 89.90,
    "promo": 0,
    "destaque": 1
  }
];



}
