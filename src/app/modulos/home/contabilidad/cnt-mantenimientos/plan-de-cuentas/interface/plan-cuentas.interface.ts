export interface ICreatePlanCuenta{
    plancuentaid: number,
    nrocuenta: string,
    periodo: number,
    escuentamayor: boolean,
    nombrecuenta: string,
    naturaleza: string,
    imputable: boolean,
    monedaid: number,
    detalle: boolean,
    centrodecosto: boolean,
    presupuesto: boolean,
    analisispatrimonioneto: boolean,
    usadocostoproduccion: boolean,
    idauditoria: number,
    destinos: IDetalleDestinos[]
} 

export interface IListPlanCuenta{
    idPlanCuenta: number,
    nroCuenta: string
    nombreCuenta: string,
    esImputable: boolean
}


export interface IPlantillaEXcelPlancuenta{
    fileName: string,
    content : string,
}

export interface ISubirPlanescuenta{
   nroCuenta: string,
   nombreCuenta: string,
   esImputable: string,
   tieneDetalle: string,
   moneda: string,
   tieneDestino: string,
   naturaleza: string,
}

 
export interface IDetalleDestinos{
    plancuentasdestinoid: number,
    nrocuentadestino : string,
    nrocuentatransferencia : string,
    porcentaje: number,
    periodo: number,
    plancuentaid: number,
    idauditoria: number,
}