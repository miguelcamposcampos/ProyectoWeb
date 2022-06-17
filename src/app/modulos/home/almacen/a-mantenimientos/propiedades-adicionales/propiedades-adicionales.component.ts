import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-propiedades-adicionales',
  templateUrl: './propiedades-adicionales.component.html'
})
export class PropiedadesAdicionalesComponent implements OnInit {

  tabColor : boolean = true;
  tabTalla : boolean = false;
  tabTemporada : boolean = false;
  tabMateriales : boolean = false;
  tabColeccion : boolean = false;

  items: MenuItem[];
  activeItem: MenuItem;
  titulo : string = "COLORES"

  constructor( 
  ) { }

  ngOnInit(): void {
    this.onTabsForm();
  }
 
  onTabsForm(){
    this.items = [
      {
        id: '1',
        label: 'COLORES', 
        icon: 'fas fa-palette', 
        command: event => {
          this.activateMenu(event);
        }
      },
      {
        id: '2',
        label: 'TALLAS', 
        icon: 'fas fa-arrows-up-down', 
        command: event => {
          this.activateMenu(event);
        }
      },
      {
        id: '3',
        label: 'TEMPORADAS', 
        icon: 'fas fa-calendar-check', 
        command: event => {
          this.activateMenu(event);
        }
      },
      {
        id: '4',
        label: 'MATERIALES', 
        icon: 'fas fa-screwdriver-wrench', 
        command: event => {
          this.activateMenu(event);
        }
      },
      {
        id: '5',
        label: 'COLECCION', 
        icon: 'fas fa-trophy', 
        command: event => {
          this.activateMenu(event);
        }
      }
    ]; 
    this.activeItem = this.items[0];
  }
  
  activateMenu(event) { 
    this.tabColor = false;
    this.tabTalla = false;
    this.tabTemporada = false;
    this.tabMateriales = false;
    this.tabColeccion = false;

    this.titulo = event.item.label

    if(event.item.id ===  "2" ){
      this.tabTalla = true; 
      this.activeItem = this.items[1];
    }else if(event.item.id ===  "3" ){
      this.tabTemporada = true; 
       this.activeItem = this.items[2];
    }else if(event.item.id ===  "4" ){
      this.tabMateriales = true; 
       this.activeItem = this.items[3];
    }else if(event.item.id ===  "5" ){
      this.tabColeccion = true; 
       this.activeItem = this.items[4];
    }else{
      this.tabColor = true;
       this.activeItem = this.items[0];
    } 
  }
 

}
