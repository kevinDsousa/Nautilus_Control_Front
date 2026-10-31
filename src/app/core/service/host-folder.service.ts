import { Injectable } from '@angular/core';
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
}
