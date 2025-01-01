import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsExpenceComponent } from './earnings-expence.component';

describe('EarningsExpenceComponent', () => {
  let component: EarningsExpenceComponent;
  let fixture: ComponentFixture<EarningsExpenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarningsExpenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EarningsExpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
