export interface Orden {
    id?: number; // El id es opcional para las nuevas órdenes
    cantidad: number;
    total: number;
    fechaOrden: string; // Puede ser Date, pero es común usar string en formularios
    producto: number; // O puedes usar un tipo más complejo si tienes un modelo de Producto
    cliente: number; // O puedes usar un tipo más complejo si tienes un modelo de Cliente
  }
  