import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { EmpresaComponent } from './configuraciones/empresa/empresa.component';
import { ProgramaLibroElectronicoComponent } from './configuraciones/programa-libro-electronico/programa-libro-electronico.component';

const routes: Routes = [
  { 
    path: 'programa-libros-electronico',
    component: ProgramaLibroElectronicoComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'empresa',
    component: EmpresaComponent,
    canActivate : [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
