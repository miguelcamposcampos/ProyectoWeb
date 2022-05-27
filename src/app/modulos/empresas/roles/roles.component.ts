import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { TreeNode } from 'primeng/api'; 
import { forkJoin, Subject } from 'rxjs';
import { IAuth } from 'src/app/auth/interface/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { DataEmpresa, IRolPorEmpresa } from '../interface/empresa.interface'; 
import { RolesService } from '../services/roles.services';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  public FlgRetornaNuevoToken: Subject<boolean> = new Subject<boolean>();
  @Input() tokenLS: any; //datos de la empresa que queremos asociar a un plan
  @Output() cerrar: any = new EventEmitter<boolean>();
  @ViewChildren("checkboxes") checkboxes!: QueryList<ElementRef>;

  cols: InterfaceColumnasGrilla[] = [];  
  opcionesSeleccionadas: TreeNode[] = [];  
  ListadeRoles!: IRolPorEmpresa[];  
  idRolSelect : number =0;
  Rolform!: FormGroup; 
  listRespData: any[] = [];
  listRespMarcado : any[] = [];
  dataTreeSelect!: TreeNode[]; 
  modalAgregarRol: boolean = false;  
  dataDesencryptada :any;
  
  constructor( 
    private swal: MensajesSwalService,
    private authService: AuthService,
    private rolesServices: RolesService,
    private form: FormBuilder,
    private generalService: GeneralService
  ) {

    this.authService.verificarAutenticacion();
    this.builform();
  }

  private builform(): void {
    this.Rolform = this.form.group({
      Rol: new FormControl (null, [Validators.required, Validators.minLength(2)]),
    });
  }

  ngOnInit(): void {   
    if (!this.tokenLS) {
      return;
    }else{
      this.onMostrarRolesPorEmpresa();
    } 

    this.cols = [
      { field: 'name', header: 'Marcar para asignar permiso, Desmarcar para quitar permiso.', visibility: true }, 
    ]; 
  }
 

  onRegresar() {
    this.cerrar.emit(false);
  }

  onMostrarRolesPorEmpresa() {
    this.rolesServices.rolesPorEmpresa().subscribe((resp) => {
      console.log('roles por empresa',resp);
      if(resp) {
        this.ListadeRoles = resp; 
        this.swal.mensajePreloader(false);
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }

  onModalAgregarRol() {
    this.modalAgregarRol = true;
  }

  onGrabarNuevorol() {
    this.modalAgregarRol = false;
    let nombre = this.Rolform.value;   
    this.rolesServices.createRol(nombre.Rol).subscribe((resp) => { 
        this.swal.mensajeExito('El Rol ah sido registrado correctamente!.');
        this.onMostrarRolesPorEmpresa()  
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }


  onModaleliminarRol(data:any){ 
    console.log('data eliminar', data);
    this.swal.mensajePregunta("¿Seguro que desea eliminar el rol " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.rolesServices.deleteRol(data.rolid).subscribe((resp) => { 
          this.onMostrarRolesPorEmpresa(); 
          this.swal.mensajeExito('El rol ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    })  
  }
 

  /* Cuando damos click a un rol, nos cargaran todos los permisos */
  onVerMenuRol(rol: any) { 
    this.listRespData = [];
    this.listRespMarcado = [];
    this.opcionesSeleccionadas = [];

    this.idRolSelect = rol;   
    this.swal.mensajePreloader(true);
    this.rolesServices.menuPorIdRol(this.idRolSelect).subscribe((resp) => {
      if (resp) {  
        this.listRespData = resp.data;
        //this.listRespMarcado = ; 
        resp.maestroMenusIdsActivados.forEach(element => {
          this.listRespMarcado.push({id : element})
        }); 
 
        let g_Modulos: any[] = this.listRespData.filter((x: any) => x.tipoMenuAplicacion === 'Modulo');
      
        let general: any[]=[];  
        let finall: any[]=[]; 

        g_Modulos.forEach((x) => {   
          let modulos: any = this.onObtenerModulos(x); 
          let g_Agrupadores: any = resp.data.filter((y: any) => y.tipoMenuAplicacion === 'Agrupador' && y.padreid === modulos.maestromenuid);
     
          g_Agrupadores.forEach((x: any) => {   
            let g_Botones: any = resp.data.filter((z: any) =>(( z.tipoMenuAplicacion === 'Boton' || z.tipoMenuAplicacion === 'ReporteMenu') &&  z.padreid === x.maestromenuid));  

            let dataTempbotones :any[] = []; 
            g_Botones.forEach((element:any) => { 
               let btn = this.onObtenerBotonMenu(element)  
                dataTempbotones.push({ 
                  data:{
                    maestromenuid : element.maestromenuid,
                    name: element.descripcion,
                    expandedIcon: "pi pi-folder-open",  
                  },   
                  children:  btn
                }); 
 
                dataTempbotones.forEach(repElement => {
                  let existeid = this.listRespMarcado.find(x => x.id  === repElement.data.maestromenuid)
                  if(existeid) {
                    this.opcionesSeleccionadas.push({data:repElement.data});    
                  } 
                }); 
             

            });  
                general.push({ 
                  data : { 
                    padreid : x.padreid,
                    maestromenuid : x.maestromenuid,
                    name:x.descripcion,
                    expandedIcon: "pi pi-folder-open", 
                  },  
                  children: dataTempbotones
                })   
                general.forEach(repElement => {
                  let existeid = this.listRespMarcado.find(y => y.id  === repElement.data.maestromenuid)
                  if(existeid) {
                    this.opcionesSeleccionadas.push({data:repElement.data});    
                  } 
                }); 
          });
 
          let g_General =  general.filter((d: any) => d.data.padreid === modulos.maestromenuid) 
            finall.push({     
              data: {
                maestromenuid :  modulos.maestromenuid, 
                name:  modulos.descripcion,
                expandedIcon: "pi pi-folder-open"
              },
              children: g_General, 
            });
   
            finall.forEach(repElement => {
              let existeid = this.listRespMarcado.find(x => x.id  === repElement.data.maestromenuid)
              if(existeid) {
                this.opcionesSeleccionadas.push({data:repElement.data});    
              } 
            }); 

         }); 

         /* Asignamos todo la estructura al componente */
          this.dataTreeSelect = finall  
          if(this.dataTreeSelect){
            this.swal.mensajePreloader(false); 
          }  

          //FUNCION PARA ORDENAR DE FORMA ALFABETICA EL OBJETO
          this.dataTreeSelect.sort(function (a, b) {
            if (a.data.name > b.data.name) {
              return 1;
            }
            if (a.data.name < b.data.name) {
              return -1;
            }
            // a must be equal to b
            return 0;
          }); 
      } 
      this.swal.mensajePreloader(false); 
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }
   

  /* Primer grupo == MODULOS == */
  onObtenerModulos(m: any) {
    let modulo = {
      maestromenuid: m.maestromenuid,
      key: m.maestromenuid,
      tag: m,
      descripcion: m.descripcion,  
    };
    return modulo;
  }

  /* Filtrar entre botones y reportes, == Funcion recursiva == */
  onObtenerBotonMenu(m: any) : any{   
    if(m.tipoMenuAplicacion){
    /* Si no es Boton o Reportes retornamos null, no se hace ramificacion */
      if (m.tipoMenuAplicacion != 'Boton' &&  m.tipoMenuAplicacion != 'ReporteMenu' ) {
        return null;
      }

      /* si es Boton se contruye un nuevo desplegable */
      if (m.tipoMenuAplicacion === 'Boton') {    
        let btn = {
          data : {
            maestromenuid: m.maestromenuid, 
            name:m.descripcion,
            expandedIcon: "pi pi-folder-open",   
          },   
        };  
 
        let existeid = this.listRespMarcado.find(x => x.id  === m.maestromenuid)
        if(existeid) {
          this.opcionesSeleccionadas.push(btn);    
        }
        return btn;  
          
      } else {
        /* Si es Reporte, se filtra la data por boton y reporte y se recorre hasta terminar la ramificacion */
        let g_Reportes :any[] = []; 

        let g_GrupoReportes = this.listRespData.filter((x) =>
                              ((x.tipoMenuAplicacion === 'Boton' || x.tipoMenuAplicacion === 'ReporteMenu')  &&  x.padreid === m.maestromenuid)); 
          
        g_GrupoReportes.forEach((rep) => {  
          g_Reportes.forEach(repElement => {
            let existeid =this.listRespMarcado.find(x => x.id  === repElement.data.maestromenuid)
            if(existeid) {
              this.opcionesSeleccionadas.push({data:repElement.data});    
            } 
          }); 


          g_Reportes.push({ 
            data: {
              name: rep.descripcion,
              maestromenuid: rep.maestromenuid,
              expandedIcon: "pi pi-folder-open",  
            },
            children:  this.onObtenerBotonMenu(rep),
          });  
        });   
 
        return g_Reportes;   
      }
    } 
  }
 

  /* al dar click en un check llamaremos nuevamente a todos los permisos */
  onActivePermiso(event:any){  
    const dataParaActivar = {
      rolid :  this.idRolSelect,
      maestromenuid : event.node.data.maestromenuid
    }
    this.swal.mensajePreloader(true); 
    this.rolesServices.activarRolMenu(dataParaActivar).subscribe((resp) => {   
      if(resp){
        this.onVerMenuRol(this.idRolSelect); 
        this.swal.mensajePreloader(false); 
      } 
      this.swal.mensajeExito('Se activó el Permiso: ' + event.node.data.name + ' correctamente!');
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  } 

  onDesactivePermiso(event:any){  
    const dataParaDesactivar = {
      rolid :  this.idRolSelect,
      maestromenuid : event.node.data.maestromenuid
    }
    this.swal.mensajePreloader(true); 
    this.rolesServices.desactivarRolMenu(dataParaDesactivar).subscribe((resp) => {  
      if(resp){
        this.onVerMenuRol(this.idRolSelect); 
        this.swal.mensajePreloader(false); 
      } 
      this.swal.mensajeExito('Se desactivó el Permiso: ' + event.node.data.name + ' correctamente!');
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  } 


  onValidateForm(campo: string) {
    return ( this.Rolform.controls[campo].errors && this.Rolform.controls[campo].touched );
  }
}



