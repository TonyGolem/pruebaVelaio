
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { AppComponent } from './app/app.component';
import { GestionPersonasComponent } from './app/components/gestion-personas/gestion-personas.component';
import { importProvidersFrom } from '@angular/core';
import { GestionTareasComponent } from './app/components/gestion-tareas/gestion-tareas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Route[] = [
  { path: 'gestion-personas', component: GestionPersonasComponent },
  { path: 'gestion-tareas', component: GestionTareasComponent },
  { path: '**', redirectTo: 'gestion-personas' }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
