import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { HostFolder } from '../../model/dto/host-folder';

@Injectable({
    providedIn: 'root',
})
export class HostFolderService extends BaseHttpService<HostFolder> {
    constructor(http: HttpClient) {
        super(http, 'host-folders');
    }

    mover(id: string, parentId: string | null): Observable<HostFolder> {
        return this.http.patch<HostFolder>(`${this.url}/${id}/move`, { parentId });
    }
}
