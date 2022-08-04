export interface IAsientoDiario {
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


export interface IListAsientoDiario {
    hasItems: boolean,
    items : IAsientoDiario[],
    label : string,
    page : number,
    pages : number,
    total : number, 
}

export interface ICrearAsientoDiario {
    estesoreria : boolean,
    fecharegistro : string,
    documentoid : number,
    secuencial : number,
    tipocambio : number,
    tipocomprobanteid : number,
    monedaid :  number,
    nombrediario : string,
    glosadiario : string,
    detalle : IDetalleAsientoDiario[]
}


export interface IDetalleAsientoDiario {
    asientodetalleid : number,
    asientoid : number,
    personaid : number,
    nrocuenta : string,
    naturaleza : string,
    importe : number,
    cambio : number,
    documentoid : number,
    nrodocumento : string,
    documentorefid : number,
    nrodocumentoref : string,
    analisis : string,
    fechadetalle : string
}