import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ATSComponent } from './ats.component';

describe('ATSComponent', () => {
  let component: ATSComponent;
  let fixture: ComponentFixture<ATSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ATSComponent]
    });
    fixture = TestBed.createComponent(ATSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
