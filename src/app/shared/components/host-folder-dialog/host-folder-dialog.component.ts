import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';
import { HostFolder, HostFolderRequest } from '../../../model/dto/host-folder';
import { HostFolderService } from '../../../core/service/host-folder.service';

@Component({
    selector: 'app-host-folder-dialog',
    standalone: true,
    imports: [CommonModule, PrimengModule, BaseModule],
    templateUrl: './host-folder-dialog.component.html',
})
export class HostFolderDialogComponent {
    form: FormGroup;
    folders: HostFolder[] = [];
    salvando = false;
    private folderId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private hostFolderService: HostFolderService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
    ) {
        const folder: HostFolder | undefined = this.config.data?.folder;
        this.folders = (this.config.data?.folders ?? []).filter((f: HostFolder) => f.id !== folder?.id);
        this.folderId = folder?.id ?? null;

        this.form = this.fb.group({
            name: [folder?.name ?? '', Validators.required],
            parentId: [folder?.parentId ?? this.config.data?.parentId ?? null],
        });
    }

    salvar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.salvando = true;
        const payload: HostFolderRequest = {
            name: this.form.value.name,
            parentId: this.form.value.parentId || null,
        };

        const request = this.folderId
            ? this.hostFolderService.atualizar(payload as any, this.folderId)
            : this.hostFolderService.salvar(payload as any);

        request.subscribe({
            next: (folder) => {
                this.salvando = false;
                this.ref.close(folder);
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
