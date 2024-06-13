import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaJuegoComponent } from './vista-juego.component';
describe('VistaJuegoComponent', () => {
  let component: VistaJuegoComponent;
  let fixture: ComponentFixture<VistaJuegoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaJuegoComponent]
    });
    fixture = TestBed.createComponent(VistaJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
