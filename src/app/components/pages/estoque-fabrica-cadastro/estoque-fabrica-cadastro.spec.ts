import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueFabricaCadastro } from './estoque-fabrica-cadastro';

describe('EstoqueFabricaCadastro', () => {
  let component: EstoqueFabricaCadastro;
  let fixture: ComponentFixture<EstoqueFabricaCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueFabricaCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoqueFabricaCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
