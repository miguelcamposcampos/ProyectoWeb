import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';  
import { AppComponent } from 'src/app/app.component';  
import { AppMenuComponent } from 'src/app/shared/components/menu/app.menu.component';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { MenuService } from 'src/app/shared/services/app.menu.service';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { VentasService } from './ventas/v-procesos/ventas/service/venta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html', 
})


export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    rotateMenuButton: boolean;
    topbarMenuActive: boolean;
    overlayMenuActive: boolean;
    staticMenuDesktopInactive: boolean;
    staticMenuMobileActive: boolean;
    menuClick: boolean;
    topbarItemClick: boolean;
    activeTopbarItem: any;
    documentClickListener: () => void; 
    menuHoverActive = false;
 

    modalTiketera : boolean = false;
    modalUbicacion : boolean = false;
    Form : FormGroup;
    FormImpresion : FormGroup;
    bloquearComboImpresoras : boolean = true; 
    arrayImpresoras: any[] = [];
    arrayEstablecimiento : ICombo[];
    arrayAlmacen : ICombo[];
    arrayByte: any;
    dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')) 
    dataDesencryptada : any; 
    impresoraPordefecto : string = "";
    hostPordefecto : string = "";
    anchoPapelPordefecto : string = "";
    Tabs: MenuItem[] = [];
    idIndexTab :any;
    activeItem: any;
 

    mostrarMenuCosntruido: boolean = false; 

    constructor(
        public renderer: Renderer2, 
        public appmenu: AppMenuComponent, 
        private menuService: MenuService,
        private primengConfig: PrimeNGConfig,
        public app: AppComponent,  
        private ventaservice : VentasService,
        private generalService : GeneralService,
        private swal : MensajesSwalService, 
        private router : Router,
        private cdr: ChangeDetectorRef
        ) {    
            this.builform();  
            this.dataDesencryptada = JSON.parse(localStorage.getItem('DatosImpresion')) 
            if(this.dataDesencryptada){
                this.impresoraPordefecto = this.dataDesencryptada.impresoraDefault;  // localStorage.getItem('impresoraDefault')
                this.hostPordefecto = this.dataDesencryptada.hostDefault; // localStorage.getItem('hostDefault')
                this.anchoPapelPordefecto = this.dataDesencryptada.anchoPapelDefault;  // localStorage.getItem('anchoPapelDefault')
            } 
        }


    public builform(){
        this.Form = new FormGroup({ 
          establecimientoid : new FormControl(null ,Validators.required),
          almacenid : new FormControl(null ,Validators.required), 
        })
    
        this.FormImpresion = new FormGroup({
          hostImpresion : new FormControl(this.impresoraPordefecto ?? null, Validators.required),
          nombreImpresora: new FormControl(this.hostPordefecto ?? null, Validators.required),
          anchoPapel: new FormControl(this.anchoPapelPordefecto ?? null)
        })
    
      }

    ngOnInit(): void { 
        this.cdr.detectChanges(); 
        this.onCargarEstablecimientos(); 
        this.onMostrarMenu();
    }

    onMostrarMenu(){
        this.mostrarMenuCosntruido = true;
    }
  
    onNuevoTab(event){ 
        if(!this.Tabs.find(x => x.label === event.label)){
           this.onAgregarNuevoTab(event);
        }else{ 
            let IdChange =  this.Tabs.findIndex(x => x.id === event.maestromenuid.toString() );  
            this.onChangeTab(IdChange);
        } 
    }
    onAgregarNuevoTab(event){   
        this.Tabs.push({   
            label : event.label,
            id: event.maestromenuid.toString(),
            routerLink: event.routerLink[0],  
            icon : event.icon
        });    

        setTimeout(() => {
            let IdActive =  this.Tabs.findIndex(x => x.id === this.Tabs[this.Tabs.length - 1].id);  
            this.activeItem = IdActive;  
        }, 100);
      
    }
    

    onEliminarTab(event: any) {   
        const tabDelete =  this.Tabs[event] 
        this.swal.mensajePregunta('¿Seguro de eliminar la pestaña ' +  tabDelete.label + ' ?').then((response) => {
            if (response.isConfirmed) {  
                this.Tabs.splice(event, 1);    
                this.cdr.detectChanges();   
                this.onChangeTab(0); 
            }
        }) 
    }

    onChangeTab(event: number) {  
        setTimeout(() => {  
            this.activeItem = event;
            let ruta = './modulos/home/'+this.Tabs[event].routerLink.slice(2)
            this.router.navigate([ruta]) 
        }, 100);
    }

     /* FIN TABS */


    onCargarEstablecimientos(){
        this.generalService.listadoComboEstablecimientos().subscribe((resp) => {  
            if(resp){
                this.arrayEstablecimiento = resp 
                if(this.dataPredeterminadosDesencryptada){
                    this.Form.patchValue({
                        establecimientoid : this.arrayEstablecimiento.find(x => x.id === +this.dataPredeterminadosDesencryptada.idEstablecimiento), 
                    })
                    this.onCargarAlmacenes(+this.dataPredeterminadosDesencryptada.idEstablecimiento);  
                }  
            } 
        })
    } 

    onObtenerEstablecimiento(event : any){ 
        if(event.value){ 
            this.onCargarAlmacenes(event.value.id) 
        } 
    }

    onCargarAlmacenes(event: number){
        this.generalService.listadoAlmacenesParams(event).subscribe((resp) =>{
            if(resp){
                this.arrayAlmacen = resp; 
                this.Form.patchValue({ 
                    almacenid : this.arrayAlmacen.find(x => x.id === +this.dataPredeterminadosDesencryptada.idalmacen),
                }) 
            }
        })
    }
 
    onGrabarPredeterminados(){
        const dataform = this.Form.value

        const PredeterminadosEncryptados : any = {
            idEstablecimiento: dataform.establecimientoid.id,
            idalmacen : dataform.almacenid.id
          }
        localStorage.setItem('Predeterminados', JSON.stringify(PredeterminadosEncryptados));   
        this.modalUbicacion = false;
    }
 
    onLoadImpresoras(){
        let host = this.FormImpresion.controls['hostImpresion'].value ?? this.hostPordefecto;
        if(!host){ 
          this.swal.mensajeAdvertencia('Debes ingresar un HOST valido');
          return;
        }
        this.ventaservice.obtenerImpresorasLista(host).subscribe((resp) => {
          if(resp){
            resp.forEach(element => {
              this.arrayImpresoras.push({nombre : element})
            });
            this.bloquearComboImpresoras = false;
          }else{
            this.bloquearComboImpresoras = true;
          } 
        })
    }
 
    onGrabarImpresionPredeterminados(){ 
        const dataform = this.FormImpresion.value    
        const DatosImpresoraEncryptado : any = {
            impresoraDefault: dataform.nombreImpresora.nombre,
            hostDefault : dataform.hostImpresion,
            anchoPapelDefault: dataform.anchoPapel,
            ConfigImpresion : 'configurado'
        }
        
        localStorage.setItem('DatosImpresion', JSON.stringify(DatosImpresoraEncryptado));  
    }


    ngAfterViewInit() {
        this.cdr.detectChanges(); 
        // hides the horizontal submenus or top menu if outside is clicked
        this.documentClickListener = this.renderer.listen('body', 'click', (event) => {
              
            if (!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;  
            }

            if (!this.menuClick && this.isHorizontal()) { 
                this.menuService.reset();
            }
 
            if (!this.menuClick) {  
                if (this.overlayMenuActive) {
                    this.overlayMenuActive = false;
                }
                if (this.staticMenuMobileActive) {
                    this.staticMenuMobileActive = false;
                }

                this.menuHoverActive = false;
                this.unblockBodyScroll();
            }
 
 
            this.topbarItemClick = false;
            this.menuClick = false; 
        });
    }

    onMenuButtonClick(event) {   
        console.log('eventeventevent',event); 
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;
        this.menuClick = false;

        if (this.app.menuMode === 'overlay' && !this.isMobile()) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }

        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
            if (this.staticMenuMobileActive) {
                this.blockBodyScroll();
            } else {
                this.unblockBodyScroll();
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {   
        this.menuClick = true;
    }
 
    onTopbarItemClick(event, item) { 
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item; 
        }
 
        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRTLChange(event) {
        this.app.isRTL = event.checked;
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
        this.primengConfig.ripple = event.checked;
    }
 

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.app.menuMode === 'overlay';
    }

    isStatic() {
        return this.app.menuMode === 'static';
    }

    isHorizontal() {
        return this.app.menuMode === 'horizontal';
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    onModalesPredeterminados(event : any){
        if(event === 'T'){
            this.modalTiketera = true;
        }else if(event === 'U'){
            this.modalUbicacion = true;
        }else{
            return;
        } 
    }
 
    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }
}
