import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeExpenceDetailsComponent } from './income-expence-details.component';

describe('IncomeExpenceDetailsComponent', () => {
  let component: IncomeExpenceDetailsComponent;
  let fixture: ComponentFixture<IncomeExpenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeExpenceDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncomeExpenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
