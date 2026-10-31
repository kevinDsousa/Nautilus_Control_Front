import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { DockerHost, DockerHostRequest } from '../../model/dto/docker-host';

@Injectable({
    providedIn: 'root',
})
export class DockerHostService extends BaseHttpService<DockerHost> {
    constructor(http: HttpClient) {
        super(http, 'docker/hosts');
    }

    testarConexao(payload: DockerHostRequest): Observable<boolean> {
        return this.http.post<boolean>(`${this.url}/test`, payload);
    }

    testarConexaoHost(id: string): Observable<boolean> {
        return this.http.post<boolean>(`${this.url}/${id}/test`, {});
    }
}
