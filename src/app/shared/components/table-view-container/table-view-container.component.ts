import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';
import { Port } from '../../../model/dto/port';
import { Container } from '../../../model/dto/container';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DockerContainerService } from '../../../core/service/docker-container.service';

@Component({
  selector: 'app-table-view-container',
  standalone: true,
  imports: [PrimengModule, BaseModule],
  templateUrl: './table-view-container.component.html',
  styleUrls: ['./table-view-container.component.css']
})
export class TableViewContainerComponent implements OnInit {
    data: Container[] = [];
    columns = [
        { field: 'Names', header: 'Nome' },
        { field: 'Status', header: 'Status' },
        { field: 'Image', header: 'Imagem' },
        { field: 'Ports', header: 'Portas' }
    ];

    constructor(private dockerContainerService: DockerContainerService) {}

    ngOnInit(): void {
        this.loadContainers();
    }

    loadContainers(): void {
      this.dockerContainerService.listarContainers()
          .pipe(
              catchError(error => {
                  return of([]);
              })
          )
          .subscribe(data => {
              this.data = data;
          });
  }

    getFormattedPorts(ports: Port[]): string {
        return ports.map(port => `${port.PublicPort}/${port.Type}`).join(', ');
    }
}
