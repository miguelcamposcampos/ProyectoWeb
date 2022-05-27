export interface IListarVentasElectronicas{ 
   enIntegracion : boolean,
   notasAltaSunat : string,
   notasBajaSunat : string,
   estado : string,
   anulado : boolean,
   altaSunatAceptada : boolean,
   bajaSunatAceptada : boolean,
   diasValidosElectronicos : number,
   altaCpePermitido : true,
   fechaAltaSunat : string,
   bajaCpePermitido : boolean,
   fechaBajaSunat : string,
   idVenta : number,
   nroRegistro : string,
   tipoDocumento : string,
   nroDocumento : string,
   fechaEmision : string,
   fechaVencimiento : string,
   clienteDocumento : string,
   clienteNombreRazSocial : string,
   moneda : string,
   importe : number,
   saldo : number,
   vendedor : string,
   fechaRegistro : string,
   usuarioRegistro : string,
   correlativoMensual : number,
   monedaId : number,
   serie : string,
   secuencial : number,
   estadoSUNAT : string
  
}


export interface IListarResumenBoleta{    
    tipoResumendId : number,
    tipoResumen : string,
    fechaResumen : string,
    notaSunat : string,
    nroTicket : string,
    aceptado : boolean
}