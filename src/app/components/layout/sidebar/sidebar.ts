import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type GrupoMenu = 'cadastros' | 'estoque' | 'movimentacoes';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  colapsada = signal(false);

  // todos os grupos começam abertos
  gruposAbertos = signal<Record<GrupoMenu, boolean>>({
    cadastros: true,
    estoque: true,
    movimentacoes: true,
  });

  alternar() {
    this.colapsada.set(!this.colapsada());
  }

  alternarGrupo(grupo: GrupoMenu) {
    this.gruposAbertos.update((atual) => ({
      ...atual,
      [grupo]: !atual[grupo],
    }));
  }

  grupoEstaAberto(grupo: GrupoMenu): boolean {
    return this.gruposAbertos()[grupo];
  }
}