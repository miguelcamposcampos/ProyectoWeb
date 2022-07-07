export interface IListarVentas {
    hasItems: boolean,
    items : IVentas[],
    label : string,
    page : number,
    pages : number,
    total : number,
}

export interface IVentas {
    anulado : boolean,
    clienteDocumento : number,
    clienteNombreRazSocial : string,
    correlativoMensial : number,
    estadoSUNAT: string,
    fechaEmision:string,
    fechaVencimiento :string,
    idVenta: number,
    importe : number,
    moneda : string,
    monedaId: number,
    nroDocumento : string,
    nroRegistro : string,
    saldo : number,
    secuencial : number,
    serie : string,
    tipoDocumento : string,
    usuartioRegistro : string,
    vendedor: string
}
export interface ICrearVenta{
    ventaid : number,
    establecimientoid: number,
    vendedorid : number,
    documentoid : number,
    correlativomensual:number,
    serieventa : string,
    secuencialventa : number,
    fechaemision: string,
    condicionpagoid: number,
    idcliente : number,
    nombrecliente : string,
    direccioncliente : string,
    monedaid: number,
    tipocambio : number,
    diasvencimiento : number,
    fechavencimiento : string,
    glosa : string,
    estadoid : boolean,  // para verificar
    dsctoglobalrporcentaje : number, // para verificar
    dsctoglobalimporte: number,
    codtipooperacion: string,
    esdeduccionanticipo: boolean,
    esafectodetraccion: boolean, 
    codigodetraccion : number,
    porcentajedetraccion : number, 
    esafectoretencion : boolean,
    motivonotaid: number,
    ordenservicio : number,
    ordencompra: number,
    fechaordencompra : string,
    esrecargoconsumo :boolean,
    cantidadtotal : number,
    importeanticipo : number,
    importedescuento : number,
    importevalorventa : number,
    importeigv : number,
    importeicbper : number, 
    importeotrostributos: number,
    importetotalventa : number,
    detalles : IVentaDetalle[],
    pedidoData?: IPedidoData[];
    ventaFacturaGuiaInfoDTO? : IVentaFacturaInfo[],
    documentoReferenciaDtos: IDocumentoReferenciaDTO[],
    condicionesPagoSunat : ICondicionPagoSunat[],
    idsCondicionPagoToDelet:number[],
    idsToDelete: number[], 
    estado : string,  
    conceptocontableid? : number
}

export interface IVentaPorId{
    detalles : IVentaDetalle[], 
    altaCpePermitido : boolean,
    altaSunatAceptada: boolean,
    anulado : boolean,
    bajaCpePermitido : boolean,
    bajaSunatAceptada: boolean,
    cantidadtotal : number,
    codigodetraccion : number,
    codtipooperacion: number,
    condicionesPagoSunat : ICondicionPagoSunat[],
    condicionpagoid: number,
    correlativomensual:number, 
    diasValidosElectronicos: number,
    diasvencimiento : number,
    direccioncliente : string,
    documentoid : number,
    documentoReferenciaDtos: IDocumentoReferenciaDTO[],
    dsctoglobalimporte: number,
    dsctoglobalrporcentaje : number,
    esafectodetraccion: boolean,
    esafectoretencion : boolean,
    esdeduccionanticipo: boolean,
    esrecargoconsumo :boolean,
    establecimientoid: number,
    estado : string,
    estadoid: boolean,
    fechaAltaSunat : string,
    fechaBajaSunat : string,
    fechaemision: string,
    fechaordencompra: string,
    fechavencimiento : string,
    glosa : string,
    idauditoria : number,
    idcliente : number,
    importeanticipo : number,
    importedescuento : number,
    importeicbper : number,
    importeigv : number,
    importeotrostributos: number,
    importetotalventa : number,
    importevalorventa : number,
    logo : string,
    monedaid: number,
    motivonotaid: number,
    nombrecliente : string,
    nombreCondicionPago : string,
    nroDocumentoCliente : string,
    nroRegistro : string,
    ordencompra : number,
    ordenservicio : number,
    pedidoData : IPedidoData,
    porcentajedetraccion : number,
    secuencialventa : number,
    serieventa : number,
    tipocambio : number,
    tipoDocumento : string,
    tipoDocumentoCliente: string,
    vendedorid: number,
    ventaFacturaGuiaInfoDTO: IVentaFacturaInfo[],
    ventaid : number,
   // conceptocontableid? : number
}

export interface ICondicionPagoSunat{
    descripcion : string,
    escredito: boolean,
    escuota : boolean
    fechapagocuota: string,
    importe : number,
    nrocuota: number,
    ventacuotascreditoid: number,
    ventaid: number
}

export interface IVentaDetalle{
    almacenid : number,
    baseimponible: number,
    cantidad : number,
    codproductofinal : string,
    descripcionproducto : string,
    despachado? : boolean,
    esafectoicbper : boolean,
    esanticipo : boolean,
    esGratuito : boolean,
    esGravada : boolean,
    fechavencimiento : string,
    igv : number,
    importedescuento : number,
    importeicbper : number,
    importeotroscargos: number,
    nrolote : number,
    nroserie: string,
    observaciones: string,
    porcentajedescuento: number,
    precioincluyeigv : boolean,
    preciounitario : number,
    precioventa : number,
    productoid: number, 
    tipoafectacionid : number,  
    unidadMedida : string,
    unidadmedidaid: number,
    valorventa : number,
    ventaAnticipoReferencia : string,
    ventaanticiporeferenciaid : number 
    ventaDetalleDetraccionTransporteInfoDTO : IDetalleDetraccionTransporte,
    propiedadesAdicionalesDTOs? : IPropiedadesAdicionales[], 
    ventadetallemigradaid: number,
    ventadetalleid: number,
    ventaid : number,
    nrocuenta: string,
}

export interface IDetalleDetraccionTransporte{
    ventadetalledetracciontransporteinfoid: number,
    ventadetalleid: number
    partidadireccion?: string,
    partidaubigeo? : string,
    llegadadireccion? : string,
    llegadaubigeo? : string,
    valreferencial : number,
    valcargaefectiva : number,
    valcargautil: number,
}

export interface IDocumentoReferenciaDTO{
    ventadocumentosreferenciaid: number,
    ventaid : number
    tipodocumentoid : number,
    seriereferencia : string,
    secuencialreferencia: string,
    esgrm : boolean,
    fechadocref :string,
}




export interface IPedidoData {
    ventapedidoid: number,
    ventaid: number,
    espedido : boolean,
    fechadespacho : string,
    estadodespachoid : number,
}


export interface IVentaFacturaInfo{
    ventafacturaguiaremitenteid: number,
    ventaid : number,
    modalidad : string,
    llegadaubigeo : string,
    llegadadireccion : string,
    partidaubigeo: string,
    partidadireccion : string,
    placavehiculo : string,
    motivotraslado : string,
    pesobruto : number,
    fechatraslado : string,
    empresatransporteruc : string,
    empresatransporterazonsocial : string,
    empresatransportemtc : string,
    nombrechofer : string,
}

export  interface IPropiedadesAdicionales{
    ventadetallepropiedadadicionalid : number,
    ventadetalleid : number,
    codsunat: number,
    descripcionpropiedad : string
}
 
export interface ICobrarSaldoPendiente{
    importedeuda : number,
    importesaldo : number,
    monedaId : number,
    pendientecobranzaid : number,
    ventaid: number
}

 