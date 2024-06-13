import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginanoencontradaComponent } from './paginanoencontrada.component';

describe('PaginanoencontradaComponent', () => {
  let component: PaginanoencontradaComponent;
  let fixture: ComponentFixture<PaginanoencontradaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginanoencontradaComponent]
    });
    fixture = TestBed.createComponent(PaginanoencontradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
