export interface IListaPedido{
    hasItems: boolean,
    items: IPedido[],
    total : number
    page : number,
    pages : number
    label : string
}

export interface IPedido{
  idVenta : number,
  nroRegistro  : string,
  tipoDocumento  : string,
  nroDocumento  : string,
  fechaEmision  : string,
  fechaVencimiento  : string,
  clienteDocumento  : string,
  clienteNombreRazSocial  :string,
  moneda : string,
  importe : number, 
  saldo :number, 
  vendedor :string,
  fechaRegistro  : string,
  usuarioRegistro  :string,
  correlativoMensual  :number,
  monedaId  :number,
  serie : string,
  secuencial :number, 
  estado : string,
  facturas : string,
  
}
 

export interface IPedidoPorId{
  
}