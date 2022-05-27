 
export interface IUbicaciones{
    departamento? : string,
    provincia?: string,
    distrito? : string,
    ubigeo? : number,
}


export interface IPorDni{
    apeMaterno : string,
    apePaterno : string,
    dni : number,
    mensaje : string,
    nombre : string,
    nombres : string,
    succes: string,
}

  
export interface IPorRuc {
    Data : DatosPorRuc,
    error: string,
    succes: boolean
}

export interface DatosPorRuc{
    condicion : string,
    departamento : string,
    DireccionCompleta : string,
    DireccionesAnexos: string,
    estado : string,
    interior : string,
    kilometro : number,
    lote : number,
    manzana : string,
    numero : number,
    razonsocial : string,
    ruc : number,
    ubigeo: number,
    UbigeoDescripcion : string,
    vianombre: string,
    viatipo : string,
    zonacodigo : number,
    zonatipo: number,
}


export interface ICombo{ 
    id : number, 
    valor1 : string,
    valor2 : string,
    valor3 : number,
    valor4 : number,
}


 
export interface IUnesco{
    Data: Unesco[];
    Error: string;
    Success: string;
}

export interface Unesco{
    Code : string,
    DescriptionEN : string,
    DescriptionES: string 
}

 

export interface IEnvioMasivo{
    mensaje : string,
    success : boolean,
    error : string
}