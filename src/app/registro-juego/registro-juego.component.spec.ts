import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroJuegoComponent } from './registro-juego.component';

describe('RegistroJuegoComponent', () => {
  let component: RegistroJuegoComponent;
  let fixture: ComponentFixture<RegistroJuegoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroJuegoComponent]
    });
    fixture = TestBed.createComponent(RegistroJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
