import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';  
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { AppAccessdeniedComponent } from 'src/app/auth/pages/acceso-denegado/app.accessdenied.component';
import { AppNotfoundComponent } from 'src/app/auth/pages/not-found/app.notfound.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home.component'; 

const routes: Routes = [
   
  {
    path: '',
    component: HomeComponent, 
    canLoad : [AuthGuard],
    canActivate : [AuthGuard],
    children : [
      {
        path: 'almacen',
        loadChildren: () => import('./almacen/almacen.module').then(m => m.AlmacenModule),
        canLoad : [AuthGuard],
        canActivateChild : [AuthGuard],
      },
      {
        path: 'compras',
        loadChildren: () => import('./compras/compras.module').then(m => m.ComprasModule),
        canLoad : [AuthGuard],
        canActivateChild : [AuthGuard],
      },
      {
        path: 'ventas',
        loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule),
        canLoad : [AuthGuard],
        canActivateChild : [AuthGuard],
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule),
        canLoad : [AuthGuard],
        canActivateChild : [AuthGuard],
      }, 
      {
        path: 'landing',
        component : LandingComponent,
      }, 
      {
        path: '', 
        redirectTo: 'landing',  
        pathMatch: 'full'
      },
      {
        path: 'modulo-no-existe',
        component : AppNotfoundComponent,
      }, 
      {
        path: '**', 
        redirectTo: 'modulo-no-existe',  
      },
     
    ]
  }, 
  {
    path: '**',
    component : AppNotfoundComponent
  },   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
