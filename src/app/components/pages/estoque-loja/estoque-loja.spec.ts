import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueLoja } from './estoque-loja';

describe('EstoqueLoja', () => {
  let component: EstoqueLoja;
  let fixture: ComponentFixture<EstoqueLoja>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueLoja]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoqueLoja);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
