export interface IListarCobranza{
    hasItems : boolean,
    items : ICobranza[],
    label : string,
    page : number,
    pages : number,
    total : number,
}

export interface ICobranza {
    correlativoMensual : number,
    fechaCobranza : string,
    fechaRegistro: string,
    glosa: string,
    idClientesEnCobranza : number[],
    idCobranza : number,
    idVentas : number[],
    importeCobrado : number,
    medioPago : string,
    medioPagoId: number,
    moneda: string,
    monedaId: number,
    nroRegistro :string,
    tipoDoc: string,
    usuarioRegistro: string,
}

 

export interface ICobranzaPorId {
    cobranzaid : number,
    correlativomensual : number,
    detalle : IDetallaCobranza[],
    documentoid : number,
    estadoid : boolean,
    fecharegistro: string,
    glosa: string,
    mediopagoid: number,
    monedaid : number,
    tipocambio : number,
    totalcobranza : number,
    idauditoria : number,
    nroRegistro: string,
    totalredondeo : number,
    idsToDelete : number[]
}


export interface IDetallaCobranza{
    aplicaretencion : boolean,
    cobranzadetalleid : number,
    cobranzaid : number,
    codcliente : string,
    documentopagorefid?: number,
    formapagoid : number,
    importecobrado : number,
    importeporcobrar : number,
    importeredondeo : number,
    importeretencion : number,
    importesaldo : number,
    nombreRazSocial : string,
    nrodocpagoref? : number,
    nrodocretencion : number,
    nroDocumento : string,
    observaciones : string,
    razonsocialcliente : string,
    tipoDoc : string,
    ventaid: number
}

export interface IPendientes{
    acuenta : number,
    documento : string,
    fProvicion : string,
    fVencimiento : string,
    moneda: string,
    monedaId : number,
    nombreRazSocial : string,
    nroDocumento : string,
    saldo : number,
    saldoCambio: number,
    secuencialDoc: number,
    serieDoc: string,
    ventaid : number
}