import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostExpensivePurchasesComponent } from './most-expensive-purchases.component';

describe('MostExpensivePurchasesComponent', () => {
  let component: MostExpensivePurchasesComponent;
  let fixture: ComponentFixture<MostExpensivePurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostExpensivePurchasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostExpensivePurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
