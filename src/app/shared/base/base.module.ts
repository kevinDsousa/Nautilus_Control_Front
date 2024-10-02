import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [],
  providers: [],
  exports: [RouterModule, ReactiveFormsModule, FormsModule, HttpClientModule],
})
export class BaseModule {}