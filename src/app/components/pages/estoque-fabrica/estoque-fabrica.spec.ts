import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueFabrica } from './estoque-fabrica';

describe('EstoqueFabrica', () => {
  let component: EstoqueFabrica;
  let fixture: ComponentFixture<EstoqueFabrica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueFabrica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoqueFabrica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
