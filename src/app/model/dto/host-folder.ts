export interface HostFolder {
    id: string;
    name: string;
    parentId?: string | null;
}

export interface HostFolderRequest {
    name: string;
    parentId?: string | null;
}
