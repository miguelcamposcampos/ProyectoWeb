export interface IAdminConceptoPorId {
    conceptocontableid: number,
    codigoconcepto: number,
    nombreconcepto: string,
    areaid: number,
    cuentaprecioventa: string,
    cuentaigv: string,
    cuentadetraccion: string,
    cuentadescuento: string,
    periodo?: number,
    monedaid:  number
    idauditoria: number
}
export interface IListAdminConcepto {
    codigo: number,
    nombre: string,
    area: string,
    cuentaPrecioVenta: string,
    cuentaIgv: string,
    cuentaDetraccion: string,
    cuentaDescuento: string,
    areaId: number,
    conceptoContableId: number
}


 