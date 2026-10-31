import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';
import { TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { DockerHostService } from '../../../core/service/docker-host.service';
import { HostFolderService } from '../../../core/service/host-folder.service';
import { HostContextService } from '../../../core/service/host-context.service';
import { DockerHost } from '../../../model/dto/docker-host';
import { HostFolder } from '../../../model/dto/host-folder';
import { HostFormDialogComponent } from '../host-form-dialog/host-form-dialog.component';
import { HostFolderDialogComponent } from '../host-folder-dialog/host-folder-dialog.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PrimengModule, BaseModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems = [
    { label: 'Home', route: '/' },
  ];

  visible: boolean = false;
  treeNodes: TreeNode[] = [];
  activeHostId: string | null = null;
  ultimoTeste: { nome: string; ok: boolean } | null = null;

  private hosts: DockerHost[] = [];
  private folders: HostFolder[] = [];

  constructor(
    private dockerHostService: DockerHostService,
    private hostFolderService: HostFolderService,
    private hostContextService: HostContextService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.hostContextService.activeHostId$.subscribe(id => this.activeHostId = id);
    this.loadAll();
  }

  toggleSidebar(): void {
    this.visible = !this.visible;
  }

  loadAll(): void {
    forkJoin({
      hosts: this.dockerHostService.buscar(),
      folders: this.hostFolderService.buscar(),
    }).subscribe(({ hosts, folders }) => {
      this.hosts = hosts;
      this.folders = folders;
      this.treeNodes = this.buildTree(null);
    });
  }

  private buildTree(parentId: string | null): TreeNode[] {
    const folderNodes: TreeNode[] = this.folders
      .filter(f => (f.parentId ?? null) === parentId)
      .map(f => ({
        key: `folder-${f.id}`,
        label: f.name,
        icon: 'pi pi-folder',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        data: { type: 'folder', folder: f },
        children: this.buildTree(f.id),
      }));

    const hostNodes: TreeNode[] = this.hosts
      .filter(h => (h.folderId ?? null) === parentId)
      .map(h => ({
        key: `host-${h.id}`,
        label: h.name,
        icon: h.tlsEnabled ? 'pi pi-globe' : 'pi pi-desktop',
        leaf: true,
        data: { type: 'host', host: h },
      }));

    return [...folderNodes, ...hostNodes];
  }

  onNodeSelect(event: { node: TreeNode }): void {
    const node = event.node;
    if (node.data?.type === 'host') {
      this.hostContextService.setActiveHost(node.data.host.id);
    }
  }

  isActiveHostNode(node: TreeNode): boolean {
    return node.data?.type === 'host' && node.data.host.id === this.activeHostId;
  }

  novaPastaRaiz(): void {
    this.abrirDialogPasta(undefined, null);
  }

  novoHostRaiz(): void {
    this.abrirDialogHost(undefined, null);
  }

  novaSubpasta(node: TreeNode, event: Event): void {
    event.stopPropagation();
    this.abrirDialogPasta(undefined, node.data.folder.id);
  }

  novoHostEmPasta(node: TreeNode, event: Event): void {
    event.stopPropagation();
    this.abrirDialogHost(undefined, node.data.folder.id);
  }

  editarNode(node: TreeNode, event: Event): void {
    event.stopPropagation();
    if (node.data.type === 'folder') {
      this.abrirDialogPasta(node.data.folder, node.data.folder.parentId ?? null);
    } else {
      this.abrirDialogHost(node.data.host, node.data.host.folderId ?? null);
    }
  }

  excluirNode(node: TreeNode, event: Event): void {
    event.stopPropagation();
    if (node.data.type === 'folder') {
      this.hostFolderService.excluir(node.data.folder.id).subscribe(() => this.loadAll());
      return;
    }

    if (this.activeHostId === node.data.host.id) {
      this.hostContextService.setActiveHost(null);
    }
    this.dockerHostService.excluir(node.data.host.id).subscribe(() => this.loadAll());
  }

  testarConexaoNode(node: TreeNode, event: Event): void {
    event.stopPropagation();
    const host: DockerHost = node.data.host;
    this.dockerHostService.testarConexaoHost(host.id).subscribe({
      next: (ok) => this.ultimoTeste = { nome: host.name, ok },
      error: () => this.ultimoTeste = { nome: host.name, ok: false },
    });
  }

  private abrirDialogPasta(folder: HostFolder | undefined, parentId: string | null): void {
    const ref = this.dialogService.open(HostFolderDialogComponent, {
      header: folder ? 'Editar pasta' : 'Nova pasta',
      modal: true,
      width: '400px',
      data: { folder, folders: this.folders, parentId }
    });
    ref.onClose.subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  private abrirDialogHost(host: DockerHost | undefined, folderId: string | null): void {
    const ref = this.dialogService.open(HostFormDialogComponent, {
      header: host ? 'Editar host' : 'Novo host Docker',
      modal: true,
      width: '500px',
      data: { host, folders: this.folders, folderId }
    });
    ref.onClose.subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }
}
