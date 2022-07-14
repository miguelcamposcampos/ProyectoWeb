import { Component } from '@angular/core';
import { PlanesService } from 'src/app/modulos/empresas/services/planes.services'; 
import { MenuService } from '../../services/app.menu.service';
 
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html' 
  })
export class AppMenuComponent{
  
    listRespData: any[] = [];
    menuSelect : any[]=[];
    LoadingCargandoMenu : boolean;  

    constructor(   
      private planesService : PlanesService, 
      private menuService : MenuService
    ){
      this.menuService.menuIdMaestro$.subscribe(val => { 
        this.LoadingCargandoMenu = true;
        this.onObtenerMenus(+val);
      });

    }
 

 
 
  onObtenerMenus( IdMaestro : number){    
    this.menuSelect =  [];
    this.listRespData = [];
    this.planesService.obtenerMenusPorUsuarioEmpresa().subscribe((resp) => {
      if(resp){     
        this.listRespData =  resp;  
        this.listRespData.sort((x, y) => x.orden - y.orden);
        //SEPARO LOS MODULOS
        let g_Modulos: any[] = this.listRespData.filter((x: any) => x.tipoMenuAplicacion === 'Modulo' && x.maestromenuid === IdMaestro);
  
        let general: any=[];
      //  let finall: any=[];
        g_Modulos.forEach((x) => {
        let modulos: any = this.onObtenerModulos(x);  
          //SEPARO LOS AGRUPADORES
          let g_Agrupadores: any = resp.filter((y: any) => y.tipoMenuAplicacion === 'Agrupador' && y.padreid === modulos.maestromenuid);
          g_Agrupadores.forEach((x: any) => { 
            //SEPARO LOS BOTONES
            let dataTempbotones :any = [];
            let g_Botones: any = resp.filter((z: any) =>(( z.tipoMenuAplicacion === 'Boton' || z.tipoMenuAplicacion === 'ReporteMenu') &&  z.padreid === x.maestromenuid));  
              g_Botones.forEach((element:any) => {

                  let btn = this.onObtenerBotonMenu(element)  
                    dataTempbotones.push({ 
                        maestromenuid : element.maestromenuid,
                        label: element.descripcion,
                        icon: element.fontawesomeicon, 
                        routerLink : ['.'+element.routerlink],
                        items: btn,     
                        idorden : element.orden, 
                    }); 
              }); 
              
              general.push({
                /* contruimos LOS AGRUPADORES children del componente */
                padreid : x.padreid,
                maestromenuid : x.maestromenuid, 
                label: x.descripcion,
                items: dataTempbotones,
                icon: x.fontawesomeicon, 
                idorden : x.orden,
                routerLink : ['.'+x.routerlink]
              })   
            });
            
          // let g_General =  general.filter((d: any) => d.padreid === modulos.maestromenuid)
          //   finall.push({  
          //       /* contruimos los modulos principales del componente */
          //       icon: x.fontawesomeicon, 
          //       maestromenuid : modulos.maestromenuid,
          //       label: modulos.descripcion,
          //       idorden: modulos.orden,
          //       items: g_General,   
          //     })
        });  
         
          this.LoadingCargandoMenu = false;   
          this.menuSelect = general;   
        this.menuSelect.sort(function (a, b) {
          if (a.orden > b.orden) {
            return 1;
          }
          if (a.orden < b.orden) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }); 
      }
    });  
 
  } 


  /* Primer grupo == MODULOS == */
  onObtenerModulos(m: any) { 
  
    let modulo = {
      icon: m.fontawesomeicon, 
      maestromenuid: m.maestromenuid,
      tag: m,
      descripcion: m.descripcion,  
    };
    return modulo;
  }

  /* Filtrar entre botones y reportes, == Funcion recursiva == */
  onObtenerBotonMenu(m: any) {
    /* Si no es Boton o Reportes retornamos null, no se hace ramificacion */
    if (m.tipoMenuAplicacion != 'ReporteMenu' ) {
        return null;
    }
   
    /* si es Boton se contruye un nuevo desplegable */
    if (m.tipoMenuAplicacion === 'Boton') {
      let btn = {
         /* contruimos LOS BOTONES children del componente */
        maestromenuid: m.maestromenuid,
        icon: m.fontawesomeicon,
        label:m.descripcion, 
        routerLink : ['./'+m.routerlink], 
      };
      return btn;
    } else {
      /* Si es Reporte, se filtra la data por boton y reporte y se recorre hasta terminar la ramificacion */
      let g_Reportes :any = [];
      let g_GrupoReportes = this.listRespData.filter((x) =>
      ((x.tipoMenuAplicacion === 'Boton' || x.tipoMenuAplicacion === 'ReporteMenu')  &&  x.padreid === m.maestromenuid)); 

      g_GrupoReportes.forEach((rep) => {  
        g_Reportes.push({
          /* contruimos REPORTES DINAMICOS children del componente */
          label:rep.descripcion,
          maestromenuid: rep.maestromenuid,
          icon: rep.fontawesomeicon,
          routerLink :['.'+rep.routerlink],
          items: this.onObtenerBotonMenu(rep),   
        }); 
      });  
      return g_Reportes;
    }
  }

}
