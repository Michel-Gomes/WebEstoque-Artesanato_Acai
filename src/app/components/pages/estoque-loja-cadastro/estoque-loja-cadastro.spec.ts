import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueLojaCadastro } from './estoque-loja-cadastro';

describe('EstoqueLojaCadastro', () => {
  let component: EstoqueLojaCadastro;
  let fixture: ComponentFixture<EstoqueLojaCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueLojaCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoqueLojaCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
