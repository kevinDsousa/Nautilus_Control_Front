export interface DockerHost {
    id: string;
    name: string;
    description?: string;
    dockerHost: string;
    tlsEnabled: boolean;
    active: boolean;
    folderId?: string | null;
    reachable?: boolean | null;
}

export interface DockerHostRequest {
    name: string;
    description?: string;
    dockerHost: string;
    tlsEnabled: boolean;
    caCert?: string;
    clientCert?: string;
    clientKey?: string;
    folderId?: string | null;
}
