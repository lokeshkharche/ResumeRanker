import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCandidateComponent } from './dashboard-candidate.component';

describe('DashboardCandidateComponent', () => {
  let component: DashboardCandidateComponent;
  let fixture: ComponentFixture<DashboardCandidateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardCandidateComponent]
    });
    fixture = TestBed.createComponent(DashboardCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
