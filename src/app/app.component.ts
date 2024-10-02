import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimengModule } from './shared/primeng/primeng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
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
export class AppComponent {
  title = 'angular-v18-template';
}
