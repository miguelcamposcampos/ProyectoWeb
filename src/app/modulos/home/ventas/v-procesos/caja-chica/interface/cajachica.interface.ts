export interface IListaCajaChica{
   hasItems : boolean, 
   items : ICajaChica[];
   total : number,
   page : number,
   pages : number,
   label : string
}

export interface ICajaChica{
   tipoDoc: string,
   nroRegistro:  string,
   cliente:  string,
   estado:  string,
   fechaEmision:  string,
   totalIngresos: number,
   totalGastos:  number,
   saldoCaja:  number,
   fechaRegistro:  string,
   usuarioRegistro:  string,
   correlativoMensual:  number,
   monedaId: number,
   moneda:  string,
   idCajaChica: number,
}


export interface ICrearCajaChica{ 
   cajachicaid: number,
   documentoid: number, 
   fechaemision: string, 
   monedaid: number,
   estadoid:  number,
   fechacierre: string,
   establecimientoid: number, 
   tipocambio: number,
   totalingresos: number, 
   totalsalidas: number,
   saldocaja: number,
   detalle: IDetalleCajaChica[],
   idsToDelete: number[]
}

export interface IDetalleCajaChica{
   cajachicadetalleid: number,
   cajachicaid: number,
   personaid: number,
   motivoid:  number,
   importe:  number,
   descripcionmotivo: string,
   usuarionombre: string,
   observacion: string,
   documentoid: number,
   nrodocumento: number,
   fechahoraemision: string
}
   
     

export interface ICajaChicaPorID{
   nroRegistro: string,
   cajachicaid: number,
   documentoid: number,
   idcliente:number,
   establecimientoid: number,
   fechaemision: string,
   secuencial: number,
   monedaid: number,
   tipocambio: 2.550000,
   estadoid: 0,
   fechacierre: string,
   reposicion: number,
   totalingresos: number,
   totalsalidas: number,
   saldocaja: number,
   idauditoria: number,
   detalle: IDetalleCajaChica[],
}