import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimengModule } from './shared/primeng/primeng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Image } from './model/dto/image';
import { DockerImagesService } from './core/service/docker-image.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    HttpClientModule,
    RouterModule,
    PrimengModule,
    NgxSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-v18-template';
  images: Image[] = [];

  constructor(private dockerImagesService: DockerImagesService) {}

  ngOnInit(): void {
    this.listarImagens();
  }

  listarImagens(): void {
    this.dockerImagesService.listarImagens().subscribe(
      (data) => {
        this.images = data;
        console.log('Imagens listadas com sucesso', data);
      },
      (error) => {
        console.error('Erro ao listar imagens', error);
      }
    );
  }
}