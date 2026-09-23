import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCesta } from '../model/item-cesta';

@Component({
  imports: [CommonModule],
  selector: 'app-cesta',
  styleUrl: './cesta.css',
  templateUrl: './cesta.html',
})
export class Cesta {
  lista: ItemCesta[] = [];

  ngOnInit(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const cestaSalva = localStorage.getItem('cesta');
    this.lista = cestaSalva ? JSON.parse(cestaSalva) : [];
  }
}
