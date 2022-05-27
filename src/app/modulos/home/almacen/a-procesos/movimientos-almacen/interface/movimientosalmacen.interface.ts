export interface IListarMovimientosAlmacen {
    hasItems : boolean,
    items : IMovimientosAlmacen[],
    label : string,
    page : number,
    pages : number,
    total : number
}

export interface IMovimientosAlmacen{
    anexo: string,
    fecha : string,
    fechaRegistro: string,
    glosa : string,
    id : number,
    idVenta : number,
    nroRegistro: string,
    registroRef: string,
    tipoMovimientoId: number,
    usuarioRegistro : string,
}

/* ANEXO */
export  interface IListarAnexosMA {
    hasItems : boolean,
    items : IAnexosMA[],
    label : string,
    page : number,
    pages : number,
    total : number
}

export interface IAnexosMA{
    categoria : string,
    codCliente : string,
    codProveedor: string,
    direccionesSecundarias: string,
    direccionPrincipal : string,
    idCliente : number,
    idPersona : number,
    idProveedor : number,
    idTrabajador : number,
    idVendedor : number,
    nombreRazSocial : string,
    nroDocumento : number

}

export interface ICrearMovimientoAlmacen {
    almacendestinoid : number,
    almacenorigenid : number,
    cantidadtotal : number,
    correlativomensual : number,
    detailIdsToDelete : number[],
    detalles: IMovimientosAlmacenDetalle[],
    fechamovimiento : string,
    idauditoria: number,
    glosa: string,
    monedaid : number,
    motivoid : number,
    personaid : number,
    tipocambio : number,
    tipomovimiento : number,
    valortotal : number
    movimientoid : number
}


export interface IMovimientosAlmacenPorId{
    almacendestinoid : number,
    almacenorigenid : number,
    cantidadtotal : number,
    compraid: number,
    correlativomensual : number,
    detalles: IMovimientosAlmacenDetalle[],
    documentoid : number,
    esreversion: boolean,
    fechamovimiento : string,
    glosa: string,
    idauditoria : number,
    monedaid : number,
    motivoid : number,
    movimientoid : number,
    nombrePersona : string,
    nroRegistro : string,
    personaid : number,
    tipocambio : number,
    tipomovimiento : number,
    valortotal : number,
    ventaid : number,
}

export interface IMovimientosAlmacenDetalle{
    cantidad : number,
    codproductofinal : string,
    descripcionproductofinal : string,
    fechavencimiento : string,
    guiaremisionref : string, 
    idauditoria? : number,
    movimientodetalleid: number,
    movimientoid : number,
    nrodocumentoref : number,
    nrolote : number,
    nroserie : number,
    preciosinigv : number,
    productoid : number,
    subtotal : number,
    tipodocumentoidref : number,
    unidadmedidaid: number
}