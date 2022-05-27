import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { AgregarEmpresaComponent } from './lista-empresas/agregar-empresa/agregar-empresa.component';   
import { RolesComponent } from './roles/roles.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { PlanesComponent } from './lista-pedidos/planes/planes.component';
import { ListaPedidosComponent } from './lista-pedidos/lista-pedidos.component';
import { AppNotfoundComponent } from 'src/app/auth/pages/not-found/app.notfound.component';  
import { ListaEmpresasComponent } from './lista-empresas/lista-empresas.component';

const routes: Routes = [
  
  {
    path: 'lista-empresas',
    component: ListaEmpresasComponent, 
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  }, 
  {
    path: 'agregar-empresa',
    component: AgregarEmpresaComponent, 
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  }, 
  {
    path: 'roles',
    component: RolesComponent, 
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  },
  {
    path: 'lista-pedidos',
    component: ListaPedidosComponent, 
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  },
  {
    path: 'planes',
    component: PlanesComponent, 
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  },
  {
    path: 'lista-usuarios',
    component: ListaUsuariosComponent, 
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  },
  {
    path: '', 
    redirectTo: 'lista-empresas', 
    pathMatch: 'full'
  },
  {
    path: 'pagina-no-encontrada',
    component : AppNotfoundComponent
  },  
  {
    path:'**',
    redirectTo: 'pagina-no-encontrada', 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
