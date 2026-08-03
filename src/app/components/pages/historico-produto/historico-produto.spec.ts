import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoProduto } from './historico-produto';

describe('HistoricoProduto', () => {
  let component: HistoricoProduto;
  let fixture: ComponentFixture<HistoricoProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoProduto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
