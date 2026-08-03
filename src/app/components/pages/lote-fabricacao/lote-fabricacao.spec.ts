import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteFabricacao } from './lote-fabricacao';

describe('LoteFabricacao', () => {
  let component: LoteFabricacao;
  let fixture: ComponentFixture<LoteFabricacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteFabricacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoteFabricacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
