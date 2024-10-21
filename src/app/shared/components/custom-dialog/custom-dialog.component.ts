import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '@app/shared/primeng/primeng.module';

@Component({
  selector: 'app-custom-dialog',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss'],
})
export class CustomDialogComponent {
  titulo: string;
  subtitulo: string;
  subtitulo2: string;

  @Output() onSim = new EventEmitter<void>();
  @Output() onNao = new EventEmitter<void>();
  @Output() onVoltar = new EventEmitter<void>();

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.titulo = this.config.data?.titulo || 'Título padrão';
    this.subtitulo = this.config.data?.subtitulo || '';
    this.subtitulo2 = this.config.data?.subtitulo2 || '';
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
