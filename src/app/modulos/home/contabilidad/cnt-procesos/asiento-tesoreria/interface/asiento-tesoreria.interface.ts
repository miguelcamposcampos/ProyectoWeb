export interface IAsientoTesoreria {
    tipoDoc : string,
    nroRegistro : string,
    tipoComprobante : string,
    nombre : string,
    fechaRegistro : string,
    usuarioRegistro : string,
    tipoComprobanteId : number,
    correlativoMensual : number,
    asientoId : number
}


export interface IListAsientoTesoreria { 
    hasItems: boolean,
    items : IAsientoTesoreria[],
    label : string,
    page : number,
    pages : number,
    total : number, 
}

export interface ICrearAsientoTesoreria {
  esdiario : boolean,
  estesoreria : boolean,
  fecharegistro : string,
  documentoid : number,
  secuencial : number,
  tipocambio : number,
  tipocomprobanteid : number,
  monedaid :  number,
  nombrediario : string,
  glosadiario : string,
  detalle : IDtealleAsientoTesoreria[]
}

export interface IDtealleAsientoTesoreria {
  asientodetalleid : number,
  asientoid : number,
  personaid : number,
  nrocuenta : string,
  naturaleza : string,
  importe : number,
  cambio : number,
  centrocosto: string,
  documentoid : number,
  nrodocumento : string,
  documentorefid : number,
  nrodocumentoref : string,
  analisis : string,
  fechadetalle : string
  fechavencimiento : string
}

 