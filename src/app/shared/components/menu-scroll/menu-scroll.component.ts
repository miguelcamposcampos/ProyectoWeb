import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-scroll',
  templateUrl: './menu-scroll.component.html',
  styleUrls: ['./menu-scroll.component.scss']
})
export class MenuScrollComponent implements OnInit {
 
  items : MenuItem[]=[];
  activeItem :any;

 
  constructor() { }

  ngOnInit(): void {
    this.items = [
      {label: 'Almacen', icon: 'pi pi-fw pi-home'},
      {label: 'Ventas', icon: 'pi pi-fw pi-calendar'},
      {label: 'Compras', icon: 'pi pi-fw pi-pencil'},
      {label: 'Contabilidad', icon: 'pi pi-fw pi-file'},
      {label: 'Almacen', icon: 'pi pi-fw pi-home'},
      {label: 'Ventas', icon: 'pi pi-fw pi-calendar'},
      {label: 'Compras', icon: 'pi pi-fw pi-pencil'},
      {label: 'Contabilidad', icon: 'pi pi-fw pi-file'},
      {label: 'Almacen', icon: 'pi pi-fw pi-home'},
      {label: 'Ventas', icon: 'pi pi-fw pi-calendar'},
      {label: 'Compras', icon: 'pi pi-fw pi-pencil'},
      {label: 'Contabilidad', icon: 'pi pi-fw pi-file'},
      {label: 'Almacen', icon: 'pi pi-fw pi-home'},
      {label: 'Ventas', icon: 'pi pi-fw pi-calendar'},
      {label: 'Compras', icon: 'pi pi-fw pi-pencil'},
      {label: 'Contabilidad', icon: 'pi pi-fw pi-file'},
      {label: 'Configuraciôn', icon: 'pi pi-fw pi-cog'}
    ];
  }

}
