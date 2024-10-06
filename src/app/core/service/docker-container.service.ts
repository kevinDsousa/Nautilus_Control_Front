import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { Container } from '../../model/dto/container';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
}
