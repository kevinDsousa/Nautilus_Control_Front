export interface Image {
    Id: string;
    RepoTags: string[];
    Created: number;
    Size: number;
    Labels?: {
        description?: string; 
        maintainer?: string; 
        name?: string;
        'org.opencontainers.image.ref.name'?: string;
        'org.opencontainers.image.version'?: string; 
        summary?: string;
        vendor?: string; 
        version?: string; 
    };
}
