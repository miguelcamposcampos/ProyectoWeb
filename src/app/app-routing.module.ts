import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';   
import { AuthGuard } from './auth/guards/auth.guard';
import { AppNotfoundComponent } from './auth/pages/not-found/app.notfound.component';
import { AppAccessdeniedComponent } from './auth/pages/acceso-denegado/app.accessdenied.component';

 
const routes : Routes = [
    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), 
    }, 
    {
      path: 'modulos',
      loadChildren: ()=> import('./modulos/modulos.module').then(m=> m.ModulosModule),
      canLoad : [AuthGuard],
      canActivate : [AuthGuard]
    },
    {
      path: 'pagina-no-encontrada',
      component : AppNotfoundComponent
    }, 
    {
      path: 'acceso-denegado',
      component : AppAccessdeniedComponent
    },  
    {
      path: '', 
      redirectTo: 'auth', 
      pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo: 'pagina-no-encontrada'
    }
    
  ]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
