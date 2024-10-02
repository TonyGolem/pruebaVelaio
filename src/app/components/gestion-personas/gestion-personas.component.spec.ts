import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPersonasComponent } from './gestion-personas.component';

describe('GestionPersonasComponent', () => {
  let component: GestionPersonasComponent;
  let fixture: ComponentFixture<GestionPersonasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionPersonasComponent]
    });
    fixture = TestBed.createComponent(GestionPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
