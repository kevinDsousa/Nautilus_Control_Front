import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Container } from '../../model/dto/container';

@Injectable({
    providedIn: 'root',
})
export class DockerContainerService {
    constructor(private http: HttpClient) {}

    private url(hostId: string): string {
        return `${environment.urlApi}docker/hosts/${hostId}/containers`;
    }

    listarContainers(hostId: string, showAll: boolean = false): Observable<Container[]> {
        const params = new HttpParams().set('showAll', showAll.toString());
        return this.http.get<Container[]>(`${this.url(hostId)}/list`, { params });
    }

    reiniciarContainer(hostId: string, containerId: string): Observable<Container> {
        return this.http.put<Container>(`${this.url(hostId)}/${containerId}/restart`, {});
    }

    removerContainer(hostId: string, containerId: string): Observable<Container> {
        return this.http.delete<Container>(`${this.url(hostId)}/${containerId}/remove`);
    }

    pararContainer(hostId: string, containerId: string): Observable<Container> {
        return this.http.put<Container>(`${this.url(hostId)}/${containerId}/stop`, {});
    }

    iniciarContainer(hostId: string, containerId: string): Observable<Container> {
        return this.http.post<Container>(`${this.url(hostId)}/${containerId}/start`, {});
    }
}
