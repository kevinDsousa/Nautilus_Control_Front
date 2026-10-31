import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';
import { Image } from '../../../model/dto/image';
import { DockerImagesService } from '../../../core/service/docker-image.service';
import { HostContextService } from '../../../core/service/host-context.service';
import { catchError, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-table-view-image',
  standalone: true,
  imports: [PrimengModule, BaseModule],
  templateUrl: './table-view-image.component.html',
  styleUrls: ['./table-view-image.component.css']
})
export class TableViewImageComponent implements OnInit, OnDestroy {
    data: Image[] = [];
    columns = [
        { field: 'Id', header: 'ID' },
        { field: 'RepoTags', header: 'Tags' },
        { field: 'Size', header: 'Tamanho' },
        { field: 'Created', header: 'Criado em'}
    ];
    activeHostId: string | null = null;

    private hostSubscription?: Subscription;

    constructor(
        private dockerImageService: DockerImagesService,
        private hostContextService: HostContextService,
    ) {}

    ngOnInit(): void {
        this.hostSubscription = this.hostContextService.activeHostId$.subscribe(hostId => {
            this.activeHostId = hostId;
            this.loadImages();
        });
    }

    ngOnDestroy(): void {
        this.hostSubscription?.unsubscribe();
    }

    loadImages(): void {
        if (!this.activeHostId) {
            this.data = [];
            return;
        }

        this.dockerImageService.listarImagens(this.activeHostId)
            .pipe(
                catchError(error => {
                    return of([]);
                })
            )
            .subscribe(data => {
                this.data = data;
            });
    }
}
