import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente',
  standalone: true,
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  isEditing: boolean = false;

  constructor(private clienteService: ClienteService, private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['']
    });
  }

  ngOnInit(): void {
    this.getClientes();
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

  addOrUpdateCliente(): void {
    if (this.clienteForm.valid) {
      if (this.isEditing) {
        this.clienteService.updateCliente(this.clienteForm.value).subscribe(
          () => {
            this.getClientes();
            this.resetForm();
          },
          (error) => {
            console.error('Error al actualizar cliente', error);
          }
        );
      } else {
        this.clienteService.createCliente(this.clienteForm.value).subscribe(
          (nuevoCliente: Cliente) => {
            this.clientes.push(nuevoCliente);
            this.resetForm();
          },
          (error) => {
            console.error('Error al crear cliente', error);
          }
        );
      }
    }
  }

  editCliente(cliente: Cliente): void {
    this.clienteForm.patchValue(cliente);
    this.isEditing = true;
  }

  deleteCliente(id: number): void {
    if (id !== undefined) {
      this.clienteService.deleteCliente(id).subscribe(
        () => {
          this.clientes = this.clientes.filter(cliente => cliente.id !== id);
        },
        (error) => {
          console.error('Error al eliminar cliente', error);
        }
      );
    }
  }

  resetForm(): void {
    this.clienteForm.reset({
      id: null,
      nombre: '',
      email: '',
      telefono: ''
    });
    this.isEditing = false;
  }
}
