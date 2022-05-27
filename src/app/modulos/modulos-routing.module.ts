import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router'; 
import { AuthGuard } from '../auth/guards/auth.guard';  
import { AppNotfoundComponent } from '../auth/pages/not-found/app.notfound.component';

const routes : Routes = [ 
  {
    path: 'empresas',
    loadChildren: () => import('./empresas/empresa.module').then(m => m.EmpresaModule),
    canLoad : [AuthGuard],
    canActivate : [AuthGuard]
  }, 
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canLoad : [AuthGuard],
    canActivate : [AuthGuard]
  },
  {
    path: 'pagina-no-encontrada',
    component : AppNotfoundComponent
  },  
  {
    path: '', 
    redirectTo: 'empresas', 
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'pagina-no-encontrada'
  }
]

@NgModule({ 
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ModulosRoutingModule { }
