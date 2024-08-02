import { Routes } from '@angular/router';
import { ProductComponent } from './pages/product/product.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { LojaComponent } from './pages/loja/loja.component';


export const routes: Routes = [
    { path: '', redirectTo: 'produtos', pathMatch: 'full' },
    { path: 'produtos', component: ProductComponent },
    { path: 'pedidos', component: PedidoComponent },
    { path: 'loja', component: LojaComponent }
];
