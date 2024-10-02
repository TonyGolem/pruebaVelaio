export interface infoPersona {
  idPersona: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  edadPersona: number;
  habilidades: InfoHabilidadesPersona[];
}

interface InfoHabilidadesPersona {
  idHabilidad: number;
  nombreHabilidad: string;
}
export type estadoTarea = 'pendiente' | 'completada';

export interface infoTarea {
  idTarea: number;
  nombreTarea: string;
  fechaLimiteTarea: string;
  estadoTarea: estadoTarea;
  personasAsociadasTarea: infoBasicaPersonaTarea[]
}

export interface infoBasicaPersonaTarea {
  idPersona: number;
  primerNombre: string;
  primerApellido: string;
}
