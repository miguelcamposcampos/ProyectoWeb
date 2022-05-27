import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router';  
import { AppErrorComponent } from './pages/error/app.error.component';
import { AppLoginComponent } from './pages/login/app.login.component';  
import { RegistroComponent } from './pages/registro/registro.component';

const routes : Routes = [

  {
    path: 'login',
    component : AppLoginComponent,
  },
  {
    path: 'registro',
    component : RegistroComponent 
  }, 
  {
    path: 'error-inesperado',
    component : AppErrorComponent
  },
 
  {
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full'
  },
 
  {
    path: '**',
    redirectTo: 'error-inesperado'
  }
]

@NgModule({ 
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
