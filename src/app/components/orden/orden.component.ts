import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdenService } from '../../services/orden.service';
import { ProductoService } from '../../services/producto.service'; // Importa el servicio de Producto
import { Orden } from '../../models/orden.model';
import { Producto } from '../../models/producto.model'; // Asegúrate de tener este modelo
import { Cliente } from '../../models/cliente.model'; // Asegúrate de tener este modelo para Clientes
import { ClienteService } from '../../services/cliente.service'; // Importa el servicio de Cliente

@Component({
  selector: 'app-orden',
  standalone: true,
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class OrdenComponent implements OnInit {
  ordenes: Orden[] = [];
  ordenForm: FormGroup;
  productos: Producto[] = []; // Agrega una propiedad para los productos
  clientes: Cliente[] = []; // Agrega una propiedad para los clientes
  isEditing: boolean = false;

  constructor(
    private ordenService: OrdenService,
    private productoService: ProductoService, // Asegúrate de inyectar el servicio
    private clienteService: ClienteService, // Asegúrate de inyectar el servicio de Cliente
    private fb: FormBuilder
  ) {
    this.ordenForm = this.fb.group({
      id: [null],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      total: [0, Validators.required],
      fechaOrden: [new Date().toISOString().split('T')[0], Validators.required],
      producto: [null, Validators.required],
      cliente: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getOrdenes();
    this.getProductos(); // Carga los productos al iniciar
    this.getClientes(); // Carga los clientes al iniciar
  }

  getOrdenes(): void {
    this.ordenService.getOrdenes().subscribe(
      (data: Orden[]) => {
        this.ordenes = data;
      },
      (error) => {
        console.error('Error al obtener órdenes', error);
      }
    );
  }

  getProductos(): void {
    this.productoService.getProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al obtener productos', error);
      }
    );
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe(
      (data: Cliente[]) => {
        this.clientes = data;
      },
      (error) => {
        console.error('Error al obtener clientes', error);
      }
    );
  }

  addOrUpdateOrden(): void {
    if (this.ordenForm.valid) {
      const ordenData = {
        ...this.ordenForm.value,
        producto: { id: this.ordenForm.value.producto }, // Asegúrate de enviar el objeto con la ID
        cliente: { id: this.ordenForm.value.cliente }  // Asegúrate de enviar el objeto con la ID
      };
  
      if (this.isEditing) {
        this.ordenService.updateOrden(ordenData).subscribe(
          () => {
            this.getOrdenes();
            this.resetForm();
          },
          (error) => {
            console.error('Error al actualizar orden', error);
          }
        );
      } else {
        this.ordenService.createOrden(ordenData).subscribe(
          (nuevaOrden: Orden) => {
            this.ordenes.push(nuevaOrden);
            this.resetForm();
          },
          (error) => {
            console.error('Error al crear orden', error);
          }
        );
      }
    }
  }
  

  editOrden(orden: Orden): void {
    this.ordenForm.patchValue(orden);
    this.isEditing = true;
  }

  deleteOrden(id: number): void {
    if (id !== undefined) {
      this.ordenService.deleteOrden(id).subscribe(
        () => {
          this.ordenes = this.ordenes.filter(ord => ord.id !== id);
        },
        (error) => {
          console.error('Error al eliminar orden', error);
        }
      );
    }
  }

  resetForm(): void {
    this.ordenForm.reset({
      id: null,
      cantidad: 1,
      total: 0,
      fechaOrden: new Date().toISOString().split('T')[0],
      producto: null,
      cliente: null
    });
    this.isEditing = false;
  }
}
