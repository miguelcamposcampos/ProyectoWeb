export interface InterfaceColumnasGrilla {
    field: string;
    header: string;
    visibility: boolean; 
    formatoFecha?: string; 
    tipoFlag?: string;
    img? : string;   
}



export class ConstantesGenerales {
    public static _FORMATO_IMAGEN_JPG_DESDE_BASE_64 = 'data:image/jpg;base64,';
    public static _FORMATO_IMAGEN_PNG_DESDE_BASE_64 = 'data:image/png;base64,'; 
    public static _FORMATO_FECHA_Y_HORA_BD = 'yyyy-MM-ddTHH:mm:ss';
    public static _FORMATO_FECHA_HORA_CON_MILIS_BD = 'yyyy-MM-ddTHH:mm:ss.SSS';
    public static _FORMATO_MINUTO_Y_SEGUNDO = 'mm:ss';
    public static _FORMATO_DDMMYYYY_HHMMSS = 'dd/MM/yyyy h:mm a'; 
    public static _FORMATO_FECHA_VISTA = 'dd/MM/yyyy'; 
    public static _FORMATO_FECHA_BUSQUEDA = 'yyyy-MM-dd'; 
    public static _FORMATO_FECHA_GRABAR = 'yyyy-MM-ddTHH:mm:ss'; 
    // NOMBRES DE LAS VARIABLES QUE SE ALOJARAN EN LOCAL STORAGE
  
    public static ES_CALENDARIO = {
      firstDayOfWeek: 1,
      dayNames: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado'
      ],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Setiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ],
      monthNamesShort: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
      ],
      today: 'Hoy',
      clear: 'Borrar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sem'
    };


    public static  arrayMeses = [
      {mes : 1, nombre : "ENERO"},
      {mes : 2, nombre : "FEBRERO"},
      {mes : 3, nombre : "MARZO"},
      {mes : 4, nombre : "ABRIL"},
      {mes : 5, nombre : "MAYO"},
      {mes : 6, nombre : "JUNIO"},
      {mes : 7, nombre : "JULIO"},
      {mes : 8, nombre : "AGOSTO"},
      {mes : 9, nombre : "SETIEMBRE"},
      {mes : 10, nombre : "OCTUBRE"},
      {mes : 11, nombre : "NOVIEMBRE"},
      {mes : 12, nombre : "DICIEMBRE"},
    ]



  
  }
  