import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Image } from '../../model/dto/image';

@Injectable({
    providedIn: 'root',
})
export class DockerImagesService extends BaseHttpService<Image> {
    constructor(http: HttpClient) {
        super(http, 'docker/images'); 
    }

    listarImagens(): Observable<Image[]> {
        return this.http.get<Image[]>(`${this.url}/list`); 
    }

    filtrarImagens(imageName: string = 'image-'): Observable<Image[]> {
        const params = new HttpParams().set('imageName', imageName);
        return this.http.get<Image[]>(`${this.url}/filter`, { params }); 
    }
}
