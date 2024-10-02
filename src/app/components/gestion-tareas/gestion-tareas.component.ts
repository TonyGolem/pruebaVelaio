import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { infoBasicaPersonaTarea, infoPersona, infoTarea } from 'src/app/models/interfacesGenerales.interfaces';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { PrimengModule } from 'src/app/modules/shared/primeng.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { formArrayMinLengthValidator, formGroupValidatorTarea, infoBasicaPersona } from 'src/app/models/formGroupValidatorTarea.interface';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-gestion-tareas',
  standalone: true,
  imports: [CommonModule, PrimengModule, FormsModule, ReactiveFormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './gestion-tareas.component.html',
  styleUrls: ['./gestion-tareas.component.scss']
})
export class GestionTareasComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;


  listadoPersonasCreadas: infoPersona[] = [];
  listadoTareasCreadas!: infoTarea[];
  crearTareaDialog: boolean = false;
  infoDetalladaTareaDialog: boolean = false;



  formGroupTarea: FormGroup<formGroupValidatorTarea> = new FormGroup<formGroupValidatorTarea>({
    idTarea: new FormControl(this.sharedService.generarIdNumerico(), { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    estadoTarea: new FormControl('pendiente', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    nombreTarea: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
    fechaLimiteTarea: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
    personasAsociadasTarea: new FormArray<FormGroup<infoBasicaPersona>>([
      new FormGroup<infoBasicaPersona>({
        idPersona: new FormControl(null, { nonNullable: true, validators: [Validators.required,] }),
        primerNombre: new FormControl(null, { nonNullable: true, validators: [Validators.required,] }),
        primerApellido: new FormControl(null, { nonNullable: true, validators: [Validators.required,] }),
      })
    ], formArrayMinLengthValidator(1))
  })
  tareaSeleccionada!: infoTarea;
  informacionPersonasAsociadas: infoPersona[] = []


  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private sharedService: SharedService) {
    effect(() => {
      this.listadoPersonasCreadas = this.sharedService.infoPersonasCreadas()
      console.log('this.listadoPersonasCreadas: ', this.listadoPersonasCreadas);
      this.listadoTareasCreadas = this.sharedService.infoTareasCreadas()
      console.log('this.listadoTareasCreadas: ', this.listadoTareasCreadas);
    })
  }

  ngOnInit(): void {

  }

  abrirModalCrearTareaDialog() {
    this.crearTareaDialog = true
  }

  asignarFormatoFechaInicioSeleccionada(event: Date) {
    let [d, m, y] = [...new Date(event).toLocaleDateString().split('T')[0].split('/')]
    let date = `${y.slice(0, 4)}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    this.formGroupTarea.controls.fechaLimiteTarea.setValue(date);
  }

  actualizarPersonasAsignadas(personasSeleccionadas: any[]) {

    const personasFormArray = this.formGroupTarea.get('personasAsociadasTarea') as FormArray;
    personasFormArray.clear();
    personasSeleccionadas.forEach(persona => {
      const personaForm = new FormGroup({
        idPersona: new FormControl(persona.idPersona, { nonNullable: true }),
        primerNombre: new FormControl(persona.primerNombre, { nonNullable: true }),
        primerApellido: new FormControl(persona.primerApellido, { nonNullable: true })
      });
      personasFormArray.push(personaForm);
    });
    if (!personasSeleccionadas.length) {

      personasFormArray.setErrors({ 'required': true });
      personasFormArray.updateValueAndValidity();

    }
  }

  crearTarea() {
    console.log(this.formGroupTarea.value);
    if (!this.formGroupTarea.valid) {
      this.messageService.add({
        severity: 'error', summary: 'Por favor complete todos los campos.', detail: `Campos por completar: ${this.findInvalidControls()} `,
      })
    } else {
      this.listadoTareasCreadas.push(this.formGroupTarea.value as infoTarea);
      this.sharedService.infoTareasCreadas.set(this.listadoTareasCreadas as infoTarea[]);
      this.formGroupTarea.reset();

      this.messageService.add({
        severity: 'success', detail: 'Tarea creada con éxito.',
      })
      this.crearTareaDialog = false;
    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls: any = this.formGroupTarea.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  confirmarCancelacionCreacionTarea() {
    this.confirmationService.confirm({
      header: 'Cancelar creación de la tarea',
      message: '¿Está seguro/a que desea cancelar la creación de la tarea?, esto eliminará todos los datos ingresados.',
      accept: () => {
        this.formGroupTarea.reset();
        this.crearTareaDialog = false;
      },
      reject: () => {
        this.crearTareaDialog = true;
      }
    })
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  estadoTarea(tarea: infoTarea) {
    if (tarea.estadoTarea !== 'completada') {
      return 'Pendiente'
    } else {
      return 'Completada'
    }
  }

  estadoRealizacionTarea(tarea: infoTarea) {
    if (tarea.estadoTarea !== 'pendiente') {
      return 'success'
    } else {
      return 'danger'
    }
  }

  marcarTareaCompletada(tareaACompletar: infoTarea) {
    this.confirmationService.confirm({
      header: 'Completar tarea',
      message: '¿Está seguro/a que desea marcar la tarea como completada?',
      acceptLabel: 'completada',
      rejectLabel: 'No completada',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        const infoTarea = this.listadoTareasCreadas.find(x => x.idTarea == tareaACompletar.idTarea);
        if (infoTarea) {
          infoTarea.estadoTarea = 'completada';
          this.messageService.add({
            severity: 'success', detail: 'Tarea marcada como completada exitosamente.',
          })
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'error', detail: 'No se cambió el estado de la tarea.',
        })
      }
    })
  }

  abrirDetalleTareaDialog(tareaAMostrar: infoTarea) {
    console.log('tareaAMostrar: ', tareaAMostrar);
    this.tareaSeleccionada = tareaAMostrar;
    this.infoDetalladaTareaDialog = true;

    tareaAMostrar.personasAsociadasTarea.forEach(persona => {

      const personaEncontrada = this.listadoPersonasCreadas.find(x => x.idPersona === persona.idPersona);
      console.log('personaEncontrada: ', personaEncontrada);
      if (personaEncontrada) {
        this.informacionPersonasAsociadas.push(personaEncontrada)
      }
    });

  }

}
