export interface DataEmpresa{
    usuarioEmpresaId: number;
    esAdmin : boolean;
    razonSocial: string;
    ruc: string;
    empresaGuid: string;
    rol: string;
}

export interface IPlanEmpresa{
  empresaGuid:string,
  empresaId: number,
  esGratuito: boolean,
  expirado: boolean,
  fechaVencimiento:string,
  planId: number,
  success: boolean,
}



export interface IEmpresaporRuc{
    Data: IEmpresa;
    Success : boolean;
    Error: string; 
}

export interface IEmpresa{ 
  empresaid: number,
  ruc :string,
  razonsocial :string ,
  nombrecomercial :string ,
  DireccionCompleta? :string ,
  direccionfiscal :string ,
  email : string,
  website :string ,
  telefonos :string,
  planid : number,
  razonestado :string ,
  ubigeo? :string,
  estadoid?: number,
  fecharegistro?: string,
}
 
 
 
 
export interface IPlanes {
  planid : number,
  nombreplan: string,
  fecharegistro?: string,
  esplangratuito? : boolean, 
}

export interface IDatosPlan {
  planesarticulosid: number,
  nombre: string,
  duracionmeses: number,
  essubscripcion: boolean,
  eslicenciaadicional: boolean,
  preciosinigv: number,
  porcdescuento: number,
  cantidadcomprobantes: number,
  importecomprobanteadicional: number,
  fecharegistro: string,
  planid: number, 
}


export interface IPedioCrate {
  planesarticulosid: number,
  cantidad: number,
  empresaguid: string
}

export interface IRolPorEmpresa{
  rolid: number,
  nombre: string,
  empresaid: number
}


export interface IUsuarios {
  emailUsuario : string,
  nombreUsuario : string,
  usuarioEmpresaId :number,
  esAdmin : boolean,
  rol : string ,
  estadoId : number,
  estado : string ,
  ultimaInteraccion : string 
}

export interface ICambiarRol{
  email : string,
  nuevoRolId: number
}

export interface IUsuarioInvitado{
  emailUsuarioInvitado : string,
  rolId: number
}



export interface IMenuPorId {
    modulo : IMenu[]
    agrupado : IMenu[]
    boton : IMenu[]
    reporte : IMenu[]
}

export interface IMenu{
  tipoMenuAplicacion: string,
  maestromenuid : number
  descripcion: string,
  form: string,
  aplicacionid: number,
  padreid: number,
  orden: number,
  fecharegistro: number,
  planid : number,
  estadoid: boolean
  usuariodeshabilitacionid:  number,
  usuariohabilitacionid :  number,
  fechadeshabilitacion: string,
  fechahabilitacion: string,
  icono: string,
  esdialogo: boolean
}


export interface IPedidoPorEmpresa{
  pedidoId: number,
  plan : string,
  planServicio : string,
  importe: number
  estado: string,
  motivoRechazo: string
  fechaRegistro: string,
  fechaRespuesta: string,
  fechaExpiracion: string,
  esGratis: boolean,
  cantidad : number 

}


export interface IModalConfirmar {
  titulo : string,
  pregunta : string,
  nombreBoton: string,
  iconoBoton : string
}

export interface IEnviarNotificarPago{
  fotovoucherdeposito : string,
  pedidoIds : number[]
}