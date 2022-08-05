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
    asientoid: number,
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
    detalle : IDetalleAsientoDiario[],
    idsToDelete: number[];
    idauditoria: number
}

export interface IDetalleAsientoDiario {
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
    fechadetalle : string,
    fechavencimiento : string
    anexo? : string
}