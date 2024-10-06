import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimengModule } from './shared/primeng/primeng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Image } from './model/dto/image';
import { DockerImagesService } from './core/service/docker-image.service';
import { HttpClientModule } from '@angular/common/http';
import { Container } from './model/dto/container';
import { DockerContainerService } from './core/service/docker-container.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    HttpClientModule,
    RouterModule,
    PrimengModule,
    RouterModule,
    NgxSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-v18-template';
  images: Image[] = [];
  containers: Container[] = [];

  constructor(private dockerImagesService: DockerImagesService, private dockerContainerService: DockerContainerService) {}

  ngOnInit(): void {
    this.listarImagens();
    this.listarContainers();
  }

  listarImagens(): void {
    this.dockerImagesService.listarImagens().subscribe(
      (data) => {
        this.images = data;
      },
      (error) => {
        console.error('Erro ao listar imagens', error);
      }
    );
  }

  listarContainers(): void {
    this.dockerContainerService.listarContainers().subscribe(
      (data) => {
        this.containers = data;
      },
      (error) => {
        console.error('Erro ao listar imagens', error);
      }
    );
  }
}