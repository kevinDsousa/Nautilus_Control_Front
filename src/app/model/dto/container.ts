import { Port } from "./port";

export interface Container {
    Command: string;
    Created: number;
    Id: string;
    Image: string;
    ImageID: string;
    Names: string[];
    Ports: Port[];
    Status: string;
    State: string;
}