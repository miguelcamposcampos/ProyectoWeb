import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { CompraFormatoSunatComponent } from './compra-formato-sunat/compra-formato-sunat.component';
import { CompraProductoAnaliticoComponent } from './compra-producto-analitico/compra-producto-analitico.component';
import { CompraProductoResumenComponent } from './compra-producto-resumen/compra-producto-resumen.component';
import { CompraProveedorAnaliticoComponent } from './compra-proveedor-analitico/compra-proveedor-analitico.component';
import { CompraProveedorDaotAnaliticoComponent } from './compra-proveedor-daot-analitico/compra-proveedor-daot-analitico.component';
import { CompraProveedorDaotResumenComponent } from './compra-proveedor-daot-resumen/compra-proveedor-daot-resumen.component';
import { DetraccionesComponent } from './detracciones/detraccionesn.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';

const routes: Routes = [
  { 
    path: 'rep-formato-sunat',
    component: CompraFormatoSunatComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'rep-producto-analitico',
    component: CompraProductoAnaliticoComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'rep-producto-resumen',
    component: CompraProductoResumenComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'rep-proveedor-analitico',
    component: CompraProveedorAnaliticoComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'rep-proveedor-daot-analitico',
    component: CompraProveedorDaotAnaliticoComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'rep-proveedor-daot-resumen',
    component: CompraProveedorDaotResumenComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'rep-detracciones',
    component: DetraccionesComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'rep-proveedores',
    component: ProveedoresComponent,
    canActivate : [AuthGuard],
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CReportesRoutingModule { }
