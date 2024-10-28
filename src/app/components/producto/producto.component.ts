import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto',
  standalone: true,
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;

  constructor(private productoService: ProductoService, private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.getProductos();
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

  createProducto(): void {
    if (this.productoForm.valid) {
      this.productoService.createProducto(this.productoForm.value).subscribe(
        (nuevoProducto: Producto) => {
          this.productos.push(nuevoProducto);
          this.resetForm();
        },
        (error) => {
          console.error('Error al crear producto', error);
        }
      );
    }
  }

  resetForm(): void {
    this.productoForm.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      estado: true
    });
  }

  deleteProducto(id: number): void {
    if (id !== undefined) {
      this.productoService.deleteProducto(id).subscribe(
        () => {
          this.productos = this.productos.filter(prod => prod.id !== id);
        },
        (error) => {
          console.error('Error al eliminar producto', error);
        }
      );
    }
  }  
}
