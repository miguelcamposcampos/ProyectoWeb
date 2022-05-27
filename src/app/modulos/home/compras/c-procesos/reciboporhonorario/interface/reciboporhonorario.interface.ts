export interface IListarRxh{
    hasItems : boolean,
    items : IRxh[],
    label : string,
    page : number,
    pages : number,
    total : number
}

export interface IRxh{
    
}


export interface ICrearRxh{
    idproveedor: number,
    correlativomensual:number,
    nombreproveedor: string,
    serierecibohonorario: string,
    documentoid: number,
    correlativorecibohonorario: number,
    fecharegistro:  string,
    fechaemision:  string,
    monedaid: number,
    tipocambio: number,
    estadoid: number,
    glosa:  string,
    esafectorentacuartacategoria: boolean,
    porcentajerentacuartacategoria: number,
    importetotal: number,
    importerentacuartacategoria: number,
    importeporpagar: number,
    totaldebesoles: number,
    totaldebedolares: number,
    totalhabersoles: number,
    totalhaberdolares: number,
    totaldiferenciadolares:number,
    totaldiferenciasoles: number,
    detalles : IDetalleRxH[],
    detallesReferencia : IDetalleReferenciaRxH[]
}

export interface IDetalleRxH{
    recibohonorariodetalleid: number,
    recibohonorarioid: number,
    importesoles: number,
    importedolares: number,
}

export interface IDetalleReferenciaRxH{
    recibohonorarioreferenciaid: number,
    recibohonorarioid: number,
    documentoid: number,
    seriereferencia: number,
    correlativoreferencia: number,
}


export interface IRxhPorId{
    
}
