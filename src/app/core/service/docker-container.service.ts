import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { Container } from '../../model/dto/container';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class DockerContainerService extends BaseHttpService<Container> {
    constructor(http: HttpClient) {
        super(http, 'docker/containers'); 
    }

    listarContainers(showAll: boolean = false): Observable<Container[]> {
        const params = new HttpParams().set('showAll', showAll.toString());
        return this.http.get<Container[]>(`${this.url}/list`, { params }); 
    }

    reiniciarContainer(containerId: string): Observable<Container> {
        return this.http.put<Container>(`${this.url}/${containerId}/restart`, {});
    }

    removerContainer(containerId: string): Observable<Container> {
        return this.http.delete<Container>(`${this.url}/${containerId}/remove`);
    }

    pararContainer(containerId: string): Observable<Container> {
        return this.http.put<Container>(`${this.url}/${containerId}/stop`, {});
    }

    iniciarContainer(containerId: string): Observable<Container> {
        return this.http.post<Container>(`${this.url}/${containerId}/start`, {});
    }
}
