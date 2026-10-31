import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../primeng/primeng.module';
import { BaseModule } from '../../base/base.module';
import { TreeDragDropService, TreeNode } from 'primeng/api';
import { TreeNodeDropEvent } from 'primeng/tree';
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
  providers: [TreeDragDropService],
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

  /**
   * PrimeNG Tree mantém internamente seus próprios listeners de drag/drop no <li> de cada nó
   * (mesmo com draggableNodes/droppableNodes desligados), então handlers DnD customizados no
   * template do nó conflitam com eles. Por isso usamos a API oficial de DnD da p-tree aqui.
   */
  onNodeDrop(event: TreeNodeDropEvent): void {
    const dragNode = event.dragNode;
    const dropNode = event.dropNode;
    if (!dragNode || !dropNode || dropNode.data?.type !== 'folder') {
      // só é permitido soltar sobre uma pasta; para tirar de uma pasta existe o botão dedicado
      return;
    }
    this.moveNode(dragNode, dropNode.data.folder.id);
  }

  moverParaRaiz(node: TreeNode, event: Event): void {
    event.stopPropagation();
    this.moveNode(node, null);
  }

  estaDentroDeUmaPasta(node: TreeNode): boolean {
    if (node.data?.type === 'folder') {
      return !!node.data.folder.parentId;
    }
    return !!node.data?.host?.folderId;
  }

  private moveNode(node: TreeNode, targetFolderId: string | null): void {
    if (node.data.type === 'folder') {
      const folder: HostFolder = node.data.folder;
      if ((folder.parentId ?? null) === targetFolderId) {
        return;
      }
      if (targetFolderId && this.isDescendantOf(targetFolderId, folder.id)) {
        return;
      }
      this.hostFolderService.mover(folder.id, targetFolderId).subscribe(() => this.loadAll());
    } else {
      const host: DockerHost = node.data.host;
      if ((host.folderId ?? null) === targetFolderId) {
        return;
      }
      this.dockerHostService.moverParaPasta(host.id, targetFolderId).subscribe(() => this.loadAll());
    }
  }

  private isDescendantOf(nodeId: string, ancestorId: string): boolean {
    let current: string | null | undefined = nodeId;
    while (current) {
      if (current === ancestorId) {
        return true;
      }
      const folder = this.folders.find(f => f.id === current);
      current = folder ? (folder.parentId ?? null) : null;
    }
    return false;
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
