import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';
import { Port } from '../../../model/dto/port';
import { Container } from '../../../model/dto/container';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DockerContainerService } from '../../../core/service/docker-container.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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
    loading: boolean = false;

    constructor(
        private dockerContainerService: DockerContainerService,
        private router: Router,
        private dialogService: DialogService,
    ) { }

    ngOnInit(): void {
        this.loadContainers();
    }

    loadContainers(): void {
        this.loading = true;
        this.dockerContainerService.listarContainers()
            .pipe(
                catchError(error => {
                    this.loading = false;
                    return of([]);
                })
            )
            .subscribe(data => {
                this.data = data;
                this.loading = false;
            });
    }

    getFormattedPorts(ports: Port[]): string {
        return ports.map(port => `${port.PublicPort}/${port.Type}`).join(', ');
    }

    getInputValue(event: Event): string {
        const target = event.target as HTMLInputElement;
        return target ? target.value : '';
    }

    truncateString(str: string, maxLength: number): string {
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    }

    editRow(rowData: Container): void {
        this.dialogService.open(EditDialogComponent, {
            data: {
                titulo: 'Editar Container',
                subtitulo: 'Deseja editar o container?',
                subtitulo2: `Nome: ${rowData.Names[0]}`,
                onSim: () => {
                    this.router.navigate(['/container/edit', rowData.Id]);
                }
            }
        })
    }

    deleteRow(rowData: Container): void {
        this.dialogService.open(DeleteDialogComponent, {
            data: {
                titulo: 'Deletar Container',
                subtitulo: 'Deseja deletar o container?',
                subtitulo2: `Nome: ${rowData.Names[0]}`,
                onSim: () => {
                    this.dockerContainerService.excluir(parseInt(rowData.Id))
                        .subscribe(() => {
                            this.loadContainers();
                        });
                }
            }
        })
    }

    createContainer(): void {
        console.log('createContainer');
    }
}
