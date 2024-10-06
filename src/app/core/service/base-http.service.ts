import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class BaseHttpService<T> {
  protected url: string;

  constructor(protected http: HttpClient, @Inject(String) rota: string) {
    this.url = `${environment.urlApi}${rota}`;
  }

  buscar(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  obterPorId(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  salvar(entidade: T): Observable<T> {
    return this.http.post<T>(this.url, entidade);
  }

  atualizar(entidade: T, id?: number): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, entidade);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  criarParametros(filtro: any): HttpParams {
    let httpParams = new HttpParams();
    for (const prop in filtro) {
      if (filtro[prop] != null && filtro[prop] !== '') {
        httpParams = httpParams.append(prop, filtro[prop]);
      }
    }
    return httpParams;
  }
}
