import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PrimengModule } from '@app/shared/primeng/primeng.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
  icone: string;
  titulo: string;
  subtitulo: string;
  subtitulo2: string;

  @Output() onSim = new EventEmitter<void>();
  @Output() onNao = new EventEmitter<void>();
  @Output() onVoltar = new EventEmitter<void>();

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.titulo = this.config.data.titulo;
    this.subtitulo = this.config.data.subtitulo;
    this.subtitulo2 = this.config.data.subtitulo2;

    this.onSim = this.config.data.onSim || new EventEmitter<void>();
    this.onNao = this.config.data.onNao || new EventEmitter<void>();
    this.onVoltar = this.config.data.onVoltar || new EventEmitter<void>();
  }

  sim() {
    this.onSim.emit();
    this.ref.close();
  }

  nao() {
    this.onNao.emit();
    this.ref.close();
  }

  voltar() {
    this.ref.close();
    this.onVoltar.emit();
  }
}
