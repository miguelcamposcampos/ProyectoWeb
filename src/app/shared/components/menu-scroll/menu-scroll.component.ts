import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { PlanesService } from 'src/app/modulos/empresas/services/planes.services';
import { MenuService } from '../../services/app.menu.service';
import { AppMenuComponent } from '../menu/app.menu.component';

@Component({
  selector: 'app-menu-scroll',
  templateUrl: './menu-scroll.component.html',
  styleUrls: ['./menu-scroll.component.scss']

})
export class MenuScrollComponent implements OnInit {
  
  public FlgRetornaNuevoToken: Subject<boolean> = new Subject<boolean>();
  items : MenuItem[]=[];
  activeItem :any;
  menuItems : any[]=[];
  listRespData: any[] = [];
  LoadingCargandoMenu : boolean = true; 


  constructor(
    public app: AppMenuComponent,
    private planesService : PlanesService,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {  
    this.onObtenerMenus();
  }



  onMenuSeleccionado(event){ 
    const clickedTab = this.menuItems.filter((x, index) => index === event);  
    this.menuService.changeMenuPadre(clickedTab[0].maestromenuid); 
  }


  onObtenerMenus(){
    this.planesService.obtenerMenusPorUsuarioEmpresa().subscribe((resp) => { 
    if(resp){    
        this.listRespData =  resp;  
        this.listRespData.sort((x, y) => x.orden - y.orden); 
        let g_Modulos: any[] = this.listRespData.filter((x: any) => x.tipoMenuAplicacion === 'Modulo'); 
        g_Modulos.forEach(x => {
          this.menuItems.push({ 
            maestromenuid : x.maestromenuid,
            label: x.descripcion
          })
        }) 
        this.LoadingCargandoMenu = false 
        if(this.menuItems){
         this.onMenuSeleccionado(0); 
        }
         
      }
    }); 
  }
  
}
