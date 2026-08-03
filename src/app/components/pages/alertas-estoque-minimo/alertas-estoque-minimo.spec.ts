import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasEstoqueMinimo } from './alertas-estoque-minimo';

describe('AlertasEstoqueMinimo', () => {
  let component: AlertasEstoqueMinimo;
  let fixture: ComponentFixture<AlertasEstoqueMinimo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertasEstoqueMinimo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertasEstoqueMinimo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
