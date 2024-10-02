import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { infoPersona } from "./interfacesGenerales.interfaces";

export interface formGroupValidatorPersona {
  idPersona: FormControl<number | null>;
  primerNombre: FormControl<string | null>;
  segundoNombre: FormControl<string | null>;
  primerApellido: FormControl<string | null>;
  segundoApellido: FormControl<string | null>;
  edadPersona: FormControl<number | null>;
  habilidades: FormArray<FormGroup<habilidadesPersona>>
}

export interface habilidadesPersona {
  idHabilidad: FormControl<number | null>;
  nombreHabilidad: FormControl<string | null>;
}

export function nombreUnicoValidator(listadoPersonasCreadas: infoPersona[], idPersona?: number): ValidatorFn {

  return (control: AbstractControl): { [key: string]: boolean } | null => {

    const primerNombreControl = control.get('primerNombre');
    const primerApellidoControl = control.get('primerApellido');

    if (!primerNombreControl || !primerApellidoControl) {
      return null;
    }

    const primerNombre = primerNombreControl.value?.trim();
    const primerApellido = primerApellidoControl.value?.trim();


    const personaDuplicada = listadoPersonasCreadas.find(persona =>
      persona.primerNombre.trim() === primerNombre &&
      persona.primerApellido.trim() === primerApellido &&
      persona.idPersona !== idPersona
    );
    return personaDuplicada ? { 'nombreDuplicado': true } : null;

  };
}
