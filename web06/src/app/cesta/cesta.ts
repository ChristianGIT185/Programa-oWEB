import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-cesta',
  styleUrl: './cesta.css',
  templateUrl: './cesta.html',
})
export class Cesta {
  lista = [
    {
      codigo: 1,
      nome: 'Martelo de Unha 25mm',
      quantidade: 2,
      valor: 39.9,
    },
    {
      codigo: 3,
      nome: 'Jogo de Chaves Allen',
      quantidade: 1,
      valor: 32.9,
    },
    {
      codigo: 8,
      nome: 'Furadeira de Impacto 650W',
      quantidade: 1,
      valor: 289.9,
    },
  ];
}
