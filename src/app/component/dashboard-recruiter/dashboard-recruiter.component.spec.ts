import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecruiterComponent } from './dashboard-recruiter.component';

describe('DashboardRecruiterComponent', () => {
  let component: DashboardRecruiterComponent;
  let fixture: ComponentFixture<DashboardRecruiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardRecruiterComponent]
    });
    fixture = TestBed.createComponent(DashboardRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
