import { Component, EventEmitter, OnInit } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';
import { Port } from '../../../model/dto/port';
import { Container } from '../../../model/dto/container';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DockerContainerService } from '../../../core/service/docker-container.service';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';

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
    ref: DynamicDialogRef | undefined;
    showAllContainers: boolean = false;
    
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
        this.dockerContainerService.listarContainers(this.showAllContainers)
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

    createContainer() {
        console.log('createContainer');
    }

    mostrarTodosContainers() {
        this.showAllContainers = !this.showAllContainers;
        this.loadContainers();
    }

    restartContainer(container: Container) {
        const onSim = new EventEmitter<void>();
        this.dialogService.open(CustomDialogComponent, {
            header: 'Reiniciar Container',
            modal: true,
            width: '400px',
            position: 'center',
            styleClass: 'post-dialog',
            data: {
                titulo: 'Deseja reiniciar o container?',
                subtitulo: 'Esta ação irá reiniciar o container.',
                subtitulo2: 'Você pode confirmar ou cancelar.',
                onSim: onSim
            }
        });
        this.ref.onClose.subscribe(() => {
            this.dockerContainerService.reiniciarContainer(container.Id).subscribe(() => {
                console.log('Container reiniciado:', container);
                this.loadContainers();
            });
        });
    }

    removeContainer(container: Container) {
        const onSim = new EventEmitter<void>();
        this.ref = this.dialogService.open(CustomDialogComponent, {
            header: 'Remover Container',
            modal: true,
            width: '400px',
            position: 'center',
            styleClass: 'post-dialog',
            data: {
                titulo: 'Deseja remover o container?',
                subtitulo: 'Esta ação não pode ser desfeita.',
                subtitulo2: 'Você pode confirmar ou cancelar.',
                onSim: onSim
            }
        });
        this.ref.onClose.subscribe(() => {
            this.dockerContainerService.removerContainer(container.Id).subscribe(() => {
                console.log('Container removido:', container);
                this.loadContainers();
            });
        });
    }

    stopContainer(container: Container) {
        const onSim = new EventEmitter<void>();
        this.dialogService.open(CustomDialogComponent, {
            header: 'Parar Container',
            modal: true,
            width: '400px',
            position: 'center',
            styleClass: 'post-dialog',
            data: {
                titulo: 'Deseja parar o container?',
                subtitulo: 'Esta ação irá parar o container.',
                subtitulo2: 'Você pode confirmar ou cancelar.',
                onSim: onSim
            },
        });
        this.ref.onClose.subscribe(() => {
            this.dockerContainerService.pararContainer(container.Id).subscribe(() => {
                console.log('Container parado:', container);
                this.loadContainers();
            });
        });
    }

    startContainer(container: Container) {
        const onSim = new EventEmitter<void>();
        this.dialogService.open(CustomDialogComponent, {
            header: 'Iniciar Container',
            modal: true,
            width: '400px',
            position: 'center',
            styleClass: 'post-dialog',
            data: {
                titulo: 'Deseja iniciar o container?',
                subtitulo: 'Esta ação irá iniciar o container.',
                subtitulo2: 'Você pode confirmar ou cancelar.',
                onSim: onSim
            }
        });
        this.ref.onClose.subscribe(() => {
            this.dockerContainerService.iniciarContainer(container.Id).subscribe(() => {
                console.log('Container iniciado:', container);
                this.loadContainers();
            });
        })
    }
}
