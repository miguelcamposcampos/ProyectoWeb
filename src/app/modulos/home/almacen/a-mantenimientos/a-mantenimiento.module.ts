import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AMantenimientoRoutingModule } from './a-mantenimiento-routing.module';
import { TransportistasComponent } from './transportistas/transportistas.component'; 
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NuevoTransportistaComponent } from './transportistas/nuevo-transportista/nuevo-transportista.component';
import { NuevoChoferComponent } from './transportistas/nuevo-chofer/nuevo-chofer.component';
import { NuevoUnidadTransporteComponent } from './transportistas/nuevo-unidad-transporte/nuevo-unidad-transporte.component';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';
import { ProductosComponent } from './productos/productos.component';
import { UnidadesdemedidaComponent } from './unidadesdemedida/unidadesdemedida.component';
import { TipodecambioComponent } from './tipodecambio/tipodecambio.component';
import { EstablecimientosComponent } from './establecimientos/establecimientos.component';
import { MarcasComponent } from './marcas/marcas.component';
import { NuevoProductoComponent } from './productos/nuevo-producto/nuevo-producto.component';
import { LineasComponent } from './lineas/lineas.component';
import { ProductoReporteComponent } from './productos/producto-reporte/producto-reporte.component';
import { SubirProductosComponent } from './productos/subir-productos/subir-productos.component';
import { NuevoUnidaddemedidaComponent } from './unidadesdemedida/nuevo-unidaddemedida/nuevo-unidaddemedida.component';
import { NuevoTipodecambioComponent } from './tipodecambio/nuevo-tipodecambio/nuevo-tipodecambio.component';
import { NuevoEstablecimientoComponent } from './establecimientos/nuevo-establecimiento/nuevo-establecimiento.component';
import { SeriesEstablecimientosComponent } from './establecimientos/series-establecimientos/series-establecimientos.component';
import { NuevoAlmacenComponent } from './establecimientos/nuevo-almacen/nuevo-almacen.component';
import { NuevoSerieComponent } from './establecimientos/series-establecimientos/nuevo-serie/nuevo-serie.component';
import { NuevoLineaComponent } from './lineas/nuevo-linea/nuevo-linea.component';
import { NuevoMarcaComponent } from './marcas/nuevo-marca/nuevo-marca.component';
import { PropiedadesAdicionalesComponent } from './propiedades-adicionales/propiedades-adicionales.component';
import { TallasComponent } from './propiedades-adicionales/tallas/tallas.component';
import { ColoresComponent } from './propiedades-adicionales/colores/colores.component'; 
import { NuevoColorComponent } from './propiedades-adicionales/colores/nuevo-color/nuevo-color.component';
import { TemporadasComponent } from './propiedades-adicionales/temporadas/temporadas.component';
import { MaterialesComponent } from './propiedades-adicionales/materiales/materiales.component';
import { ColeccionComponent } from './propiedades-adicionales/coleccion/coleccion.component';
 
 

@NgModule({
  declarations: [
    TransportistasComponent,
      NuevoTransportistaComponent,
      NuevoChoferComponent,
      NuevoUnidadTransporteComponent,

    ProductosComponent,
      NuevoProductoComponent,
      ProductoReporteComponent,
      SubirProductosComponent,

    UnidadesdemedidaComponent,
     NuevoUnidaddemedidaComponent,

    TipodecambioComponent,
     NuevoTipodecambioComponent,

    EstablecimientosComponent,
      NuevoAlmacenComponent,
      NuevoEstablecimientoComponent,
      SeriesEstablecimientosComponent,
        NuevoSerieComponent,

   

    MarcasComponent,
      NuevoMarcaComponent,

    LineasComponent,
      NuevoLineaComponent,
    
    PropiedadesAdicionalesComponent,
      ColoresComponent,
        NuevoColorComponent,
      TallasComponent,
      TemporadasComponent,
      MaterialesComponent,
      ColeccionComponent,
    
  ],
  imports: [
    CommonModule,
    AMantenimientoRoutingModule,
    ReactiveFormsModule,
    PrimeNGModule, 
    FormsModule,
    SharedModulosModule, 
  ],

  exports: [ 
    TipodecambioComponent,
    NuevoTipodecambioComponent,
  ]
})
export class AMantenimientoModule { }
