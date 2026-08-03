import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentacaoFabrica } from './movimentacao-fabrica';

describe('MovimentacaoFabrica', () => {
  let component: MovimentacaoFabrica;
  let fixture: ComponentFixture<MovimentacaoFabrica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentacaoFabrica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentacaoFabrica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
