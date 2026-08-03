import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteFabricacaoCadastro } from './lote-fabricacao-cadastro';

describe('LoteFabricacaoCadastro', () => {
  let component: LoteFabricacaoCadastro;
  let fixture: ComponentFixture<LoteFabricacaoCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteFabricacaoCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoteFabricacaoCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
