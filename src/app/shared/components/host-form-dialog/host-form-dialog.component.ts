import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';
import { DockerHost, DockerHostRequest } from '../../../model/dto/docker-host';
import { HostFolder } from '../../../model/dto/host-folder';
import { DockerHostService } from '../../../core/service/docker-host.service';

@Component({
    selector: 'app-host-form-dialog',
    standalone: true,
    imports: [CommonModule, PrimengModule, BaseModule],
    templateUrl: './host-form-dialog.component.html',
    styleUrls: ['./host-form-dialog.component.css']
})
export class HostFormDialogComponent implements OnInit {
    form: FormGroup;
    folders: HostFolder[] = [];
    testando = false;
    salvando = false;
    resultadoTeste: 'sucesso' | 'falha' | null = null;
    private hostId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private dockerHostService: DockerHostService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
    ) {
        const host: DockerHost | undefined = this.config.data?.host;
        this.folders = this.config.data?.folders ?? [];
        this.hostId = host?.id ?? null;

        this.form = this.fb.group({
            name: [host?.name ?? '', Validators.required],
            description: [host?.description ?? ''],
            dockerHost: [host?.dockerHost ?? 'unix:///var/run/docker.sock', Validators.required],
            tlsEnabled: [host?.tlsEnabled ?? false],
            caCert: [''],
            clientCert: [''],
            clientKey: [''],
            folderId: [host?.folderId ?? this.config.data?.folderId ?? null],
        });
    }

    ngOnInit(): void {}

    get isEdicao(): boolean {
        return !!this.hostId;
    }

    private montarPayload(): DockerHostRequest {
        const valor = this.form.value;
        return {
            name: valor.name,
            description: valor.description,
            dockerHost: valor.dockerHost,
            tlsEnabled: !!valor.tlsEnabled,
            caCert: valor.caCert || undefined,
            clientCert: valor.clientCert || undefined,
            clientKey: valor.clientKey || undefined,
            folderId: valor.folderId || null,
        };
    }

    testarConexao(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.testando = true;
        this.resultadoTeste = null;
        this.dockerHostService.testarConexao(this.montarPayload()).subscribe({
            next: (ok) => {
                this.resultadoTeste = ok ? 'sucesso' : 'falha';
                this.testando = false;
            },
            error: () => {
                this.resultadoTeste = 'falha';
                this.testando = false;
            }
        });
    }

    salvar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.salvando = true;
        const payload = this.montarPayload();

        const request = this.hostId
            ? this.dockerHostService.atualizar(payload as any, this.hostId)
            : this.dockerHostService.salvar(payload as any);

        request.subscribe({
            next: (host) => {
                this.salvando = false;
                this.ref.close(host);
            },
            error: () => {
                this.salvando = false;
            }
        });
    }

    cancelar(): void {
        this.ref.close();
    }
}
