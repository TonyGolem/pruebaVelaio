import { Injectable, signal, WritableSignal } from '@angular/core';
import { infoPersona, infoTarea } from 'src/app/models/interfacesGenerales.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  infoPersonasCreadas: WritableSignal<infoPersona[]> = signal([{
    "idPersona": 1727814739818,
    "primerNombre": "David",
    "segundoNombre": "Eduardo",
    "primerApellido": "Alvarado",
    "segundoApellido": "Martínez ",
    "edadPersona": 24,
    "habilidades": [
      {
        "idHabilidad": 1727813971978,
        "nombreHabilidad": "Ionic"
      },
      {
        "idHabilidad": 0,
        "nombreHabilidad": "angular"
      },
      {
        "idHabilidad": 0,
        "nombreHabilidad": "UI/UX"
      }
    ]
  }]);

  infoTareasCreadas: WritableSignal<infoTarea[]> = signal([{
    "idTarea": 1727880865097,
    "estadoTarea": "pendiente",
    "nombreTarea": "Presentar prueba técnica para VELAIO",
    "fechaLimiteTarea": "2024-10-01",
    "personasAsociadasTarea": [
      {
        "idPersona": 1727814739818,
        "primerNombre": "David",
        "primerApellido": "Alvarado"
      }
    ]
  }])

  constructor() { }

  generarIdNumerico(): number {
    const id = Math.floor(Math.random() * 1000000) + Date.now();
    return id;
  }

}
