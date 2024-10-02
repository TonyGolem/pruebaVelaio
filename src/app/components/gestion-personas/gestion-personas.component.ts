import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/modules/shared/primeng.module';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { formGroupValidatorPersona, habilidadesPersona, nombreUnicoValidator } from 'src/app/models/formGroupValidatorPersona.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { infoPersona } from 'src/app/models/interfacesGenerales.interfaces';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-gestion-personas',
  standalone: true,
  imports: [CommonModule, PrimengModule, FormsModule, ReactiveFormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './gestion-personas.component.html',
  styleUrls: ['./gestion-personas.component.scss']
})
export class GestionPersonasComponent {

  crearPersonaDialog: boolean = false;
  editarPersonaDialog: boolean = false;
  verDetallePersonaDialog: boolean = false;
  listadoPersonasCreadas: infoPersona[] = [];
  @ViewChild('dt') dt: Table | undefined;


  formGroupPersona: FormGroup<formGroupValidatorPersona> = new FormGroup<formGroupValidatorPersona>({
    idPersona: new FormControl(this.sharedService.generarIdNumerico(), { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    primerNombre: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    segundoNombre: new FormControl(''),
    primerApellido: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    segundoApellido: new FormControl(''),
    edadPersona: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.min(18)] }),
    habilidades: new FormArray<FormGroup<habilidadesPersona>>([
      new FormGroup<habilidadesPersona>({
        idHabilidad: new FormControl(this.sharedService.generarIdNumerico(), { nonNullable: true }),
        nombreHabilidad: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
      })
    ])
  });
  personaSeleccionada!: infoPersona;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private sharedService: SharedService) {

    effect(() => {
      this.listadoPersonasCreadas = this.sharedService.infoPersonasCreadas()

      //* por temas de sincronia, agrego el validador del nombre unico solamente cuando this.listadoPersonasCreadas ya tiene valor asignado del signal, porque o si no nunca va a validar el valor predeterminado
      this.formGroupPersona.setValidators(nombreUnicoValidator(this.listadoPersonasCreadas));
      this.formGroupPersona.updateValueAndValidity();
    })
  }

  abrirModalCrearPersonaDialog() {
    this.crearPersonaDialog = true
  }

  abrirModalEditarPersona(personaAEditar: infoPersona) {

    this.editarPersonaDialog = true;

    this.formGroupPersona.patchValue({
      idPersona: personaAEditar.idPersona,
      primerNombre: personaAEditar.primerNombre,
      segundoNombre: personaAEditar.segundoNombre,
      primerApellido: personaAEditar.primerApellido,
      segundoApellido: personaAEditar.segundoApellido,
      edadPersona: personaAEditar.edadPersona,
    });

    const habilidadesMapeadas = new FormArray<FormGroup<habilidadesPersona>>(
      personaAEditar.habilidades.map(habilidad => new FormGroup<habilidadesPersona>({
        idHabilidad: new FormControl(habilidad.idHabilidad, { nonNullable: true }),
        nombreHabilidad: new FormControl(habilidad.nombreHabilidad, { nonNullable: true, validators: [Validators.required] }),
      }))
    )

    this.formGroupPersona.setControl('habilidades', habilidadesMapeadas)

    this.formGroupPersona.setValidators(nombreUnicoValidator(this.listadoPersonasCreadas, personaAEditar.idPersona));
    this.formGroupPersona.updateValueAndValidity();

  }

  addHabilidad() {
    let nuevaHabilidad = new FormGroup<habilidadesPersona>({
      idHabilidad: new FormControl(this.sharedService.generarIdNumerico()),
      nombreHabilidad: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
    });
    this.formGroupPersona.controls.habilidades.push(nuevaHabilidad)
  }

  eliminarHabilidad(index: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar la habilidad?',
      header: `Eliminar Habilidad Nº ${index}`,
      icon: 'pi pi-exclamation',
      acceptLabel: 'Eliminar Habilidad',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-danger ',
      accept: () => {
        this.formGroupPersona.controls.habilidades.removeAt(index);
        this.messageService.add({
          severity: 'success', detail: 'Habilidad eliminada.',
        })
      },
      reject: () => {
        this.messageService.add({
          severity: 'info', detail: 'No se realizaron cambios.',
        })
      }
    })
  }


  guardarPersona() {

    if (!this.formGroupPersona.valid) {
      //* valido por nombreDuplicado porque así se llama lo que retorna el método de validación que se creó en el formGroupVlidatorsPersona.interface.ts

      //* y antes que olvide mencionarlo, pude haber creado ese método dentro de este mismo componente, pero por buenas prácticas lo saque a ese archivo, opino que el código queda más organizado y entendible para el futuro
      if (this.formGroupPersona.hasError('nombreDuplicado')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El nombre y apellido ya están registrados.',
        });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Por favor complete todos los campos.', detail: `Campos por completar: ${this.findInvalidControls()} `,
        })
      }


    } else {
      //* primero se hace el .push al array de personas existentes para después actualizar el valor del signal, funcionando de manera parecida a un @input o @output y cambiando el estado, pero de esta manera puedo actualizarlo a los demás componentes de la APP sin tener código repetido

      this.listadoPersonasCreadas.push(this.formGroupPersona.value as infoPersona)
      //* emite el estado  al componente de tareas para poder tener el listado de las personas creadas.
      this.sharedService.infoPersonasCreadas.set(this.listadoPersonasCreadas as infoPersona[]);

      this.formGroupPersona.reset();
      this.messageService.add({
        severity: 'success', detail: 'Persona creada con éxito.',
      })
      this.crearPersonaDialog = false;
    }
  }


  editarPersona(IDPersonaAEditar: number | null) {


    if (!this.formGroupPersona.valid) {
      this.messageService.add({
        severity: 'error', summary: 'Por favor complete todos los campos.', detail: `Campos por completar: ${this.findInvalidControls()} `,
      })
    } else {

      // * busco el index de la persona en el array por medio del IdPerosna, este es unico porque se genera aleatoriamente, actualizo el valor de esa posicion con la nueva info del formulario y luego hago el update del signal, cambiando el estado global
      const index = this.listadoPersonasCreadas.findIndex(persona => persona.idPersona === IDPersonaAEditar);


      if (index !== -1) {
        this.listadoPersonasCreadas[index] = this.formGroupPersona.value as infoPersona
      }

      this.sharedService.infoPersonasCreadas.set(this.listadoPersonasCreadas as infoPersona[]);

      this.formGroupPersona.reset();
      this.editarPersonaDialog = false;
      this.messageService.add({
        severity: 'success', detail: 'Persona editada con éxito.',
      })
    }
  }


  findInvalidControls() {
    const invalid = [];
    const controls: any = this.formGroupPersona.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }


  abrirModalVerDetallePersona(persona: infoPersona) {
    this.verDetallePersonaDialog = true;
    this.personaSeleccionada = persona
  }

  confirmarCancelacionCreacionPersona() {
    this.confirmationService.confirm({
      header: 'Cancelar creación de la persona',
      message: '¿Está seguro/a que desea cancelar la creación de la persona?, esto eliminará todos los datos ingresados.',
      accept: () => {
        this.formGroupPersona.reset();
        this.crearPersonaDialog = false;
      },
      reject: () => {
        this.crearPersonaDialog = true;
      }
    })
  }
}
