export interface Producto {
    id: number; // Asegúrate de que id sea un número y no undefined
    nombre: string;
    descripcion?: string;
    precio: number;
    estado: boolean;
  }
  