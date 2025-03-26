export interface User {
    id: string;
    name: string;
    role: number;
}

export interface Client {
    id: string;
    nombre: string;
    identificacion: string;
    sector: string;
    plan: string;
    ipv4?: string;
    telefonos: string;
    router?: string;
    saldo: number;
    estado: string;
}

export interface LastPays {
    id: string;
    motivo: string;
    cliente: string;
    fecha: string;
    montoUSD: number;
    montoVES: number;
    tipoPago: string;
    referencia: string;
    estado: string;
}

export interface CollectionsChartDTO {
    dim0: string;
    mea0: number;
    mea1: number;
    __id: string;
}

export interface PieChartDTO {
    dim0: string;
    mea0: string;
    __id: number;
}
