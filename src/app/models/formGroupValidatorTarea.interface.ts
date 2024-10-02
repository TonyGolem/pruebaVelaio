import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { estadoTarea } from "./interfacesGenerales.interfaces";

export interface formGroupValidatorTarea {
  idTarea: FormControl<number | null>;
  nombreTarea: FormControl<string | null>;
  fechaLimiteTarea: FormControl<string | null>;
  estadoTarea: FormControl<estadoTarea | null>;
  personasAsociadasTarea: FormArray<FormGroup<infoBasicaPersona>>
}

export interface infoBasicaPersona {
  idPersona: FormControl<number | null>;
  primerNombre: FormControl<string | null>;
  primerApellido: FormControl<string | null>;
}
export function formArrayMinLengthValidator(minLength: number): Validators {
  return (formArray: FormArray): { [key: string]: boolean } | null => {
    return formArray.length >= minLength ? null : { 'minLength': true };
  };
}
