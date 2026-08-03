import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as MovimentacaoLojaModule from './movimentacao-loja';

describe('MovimentacaoLojaComponent', () => {
  let component: any;
  let fixture: ComponentFixture<any>;

  beforeEach(async () => {
    const ComponentClass = (MovimentacaoLojaModule as any).MovimentacaoLojaComponent
      || (MovimentacaoLojaModule as any).default
      || MovimentacaoLojaModule;

    await TestBed.configureTestingModule({
      declarations: [ComponentClass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentClass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
