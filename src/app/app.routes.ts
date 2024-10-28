import { Routes } from '@angular/router';
import { ProductoComponent } from './components/producto/producto.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { OrdenComponent } from './components/orden/orden.component';

export const routes: Routes = [
    {
        path: '',
        component: ProductoComponent,
        title: 'pagina de producto'
    },
    {
        path: 'cliente',
        component: ClienteComponent,
        title: 'pagina de Cliente'
    },
    {
        path: 'ordenes',
        component: OrdenComponent,
        title: 'pagina de ordenes'
    }
];
