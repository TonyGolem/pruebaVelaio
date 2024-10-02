import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from './modules/shared/primeng.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [PrimengModule]
})
export class AppComponent implements OnInit {
  title = 'prueba Velaio';
  items: MenuItem[] | undefined;


  ngOnInit(): void {
    this.items = [
      {
        label: 'Gestión de usuarios',
        icon: 'pi pi-users',
        routerLink: ['/gestion-personas']
      },
      {
        label: 'Gestión de tareas',
        icon: 'pi pi-list-check',
        routerLink: ['/gestion-tareas']
      }
    ]
  }

}
