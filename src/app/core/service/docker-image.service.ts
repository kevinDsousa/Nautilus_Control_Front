import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Image } from '../../model/dto/image';

@Injectable({
    providedIn: 'root',
})
export class DockerImagesService {
    constructor(private http: HttpClient) {}

    private url(hostId: string): string {
        return `${environment.urlApi}docker/hosts/${hostId}/images`;
    }

    listarImagens(hostId: string, showAll: boolean = false): Observable<Image[]> {
        const params = new HttpParams().set('showAll', showAll.toString());
        return this.http.get<Image[]>(`${this.url(hostId)}/list`, { params });
    }

    filtrarImagens(hostId: string, imageName: string = 'image-'): Observable<Image[]> {
        const params = new HttpParams().set('imageName', imageName);
        return this.http.get<Image[]>(`${this.url(hostId)}/filter`, { params });
    }
}
