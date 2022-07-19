export interface IListarDocumentos{
    documentoid: number,
    nombre: string,
    siglasdocumento : string,
    esadelanto? : boolean,
    esanticipo : boolean,
    escajabanco : boolean,
    escontable : boolean,
    escotizacion : boolean,
    esdesunat : boolean,
    esguiaremision: boolean,
    esnotacredito: boolean,
    esnotaingresoalmacen : boolean,
    esnotasalidaalmacen: boolean,
    esordencompra: boolean,
    espedido : boolean,
    idauditoria : number,
    muevestock : boolean,
    requierenrodocumento : boolean,
    usadocompras : boolean,
    usadorecibohonorario : boolean,
    usadoventas: boolean,
    nrocuentacobranza: string
}

 