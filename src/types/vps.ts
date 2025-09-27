export interface TableVPS {
    id: number;
    port: number;
    ip: string;
    userName: string;
    friendlyName: string;
}

export interface VPSDto {
    friendlyName: string;
    ip: string;
    port: number;
    userName: string;
    password: string;
}

