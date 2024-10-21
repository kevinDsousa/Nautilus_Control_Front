import { Component, Input, OnInit } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';
import { Image } from '../../../model/dto/image';
import { DockerImagesService } from '../../../core/service/docker-image.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-table-view-image',
  standalone: true,
  imports: [PrimengModule, BaseModule],
  templateUrl: './table-view-image.component.html',
  styleUrls: ['./table-view-image.component.css']
})
export class TableViewImageComponent implements OnInit {
    data: Image[] = [];
    columns = [
        { field: 'Id', header: 'ID' },
        { field: 'RepoTags', header: 'Tags' },
        { field: 'Size', header: 'Tamanho' },
        { field: 'Created', header: 'Criado em'}
    ];

    constructor(private dockerImageService: DockerImagesService) {}

    ngOnInit(): void {
      this.loadImages();
  }

  loadImages(): void {
    this.dockerImageService.listarImagens()
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
