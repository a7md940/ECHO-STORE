export interface Computer {
    CPU: string;
    Company: string;
    Graphics: string;
    Inches: string;
    Memory: string;
    OpSys: string;
    Price: number;
    Product: string;
    RAM: string;
    Resolution: string;
    Type: string;
    Weight: string;
    _id: string;
}
export interface ComputerDTO {
    count?: number;
    computers: Array<Computer>
}