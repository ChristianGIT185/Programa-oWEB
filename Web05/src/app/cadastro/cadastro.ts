import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})

export class Cadastro {
  cadastro: FormGroup;

  constructor(private formulario: FormBuilder) {
    this.cadastro = this.formulario.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required],
      nascimento: [''],
      cidade: [''],
      estado: [''],
      termos: [false, Validators.requiredTrue]
    });
  }

  cadastrar(): void {
    if (this.cadastro.invalid) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const dados = this.cadastro.value;

    if (dados.senha !== dados.confirmarSenha) {
      alert('As senhas não são iguais.');
      return;
    }

    console.log('Cadastro:', dados);

    alert('Cadastro realizado com sucesso!');

    this.cadastro.reset();
  }
}
