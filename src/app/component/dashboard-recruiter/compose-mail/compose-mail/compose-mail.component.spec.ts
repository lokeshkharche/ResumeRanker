import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeMailComponent } from './compose-mail.component';

describe('ComposeMailComponent', () => {
  let component: ComposeMailComponent;
  let fixture: ComponentFixture<ComposeMailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComposeMailComponent]
    });
    fixture = TestBed.createComponent(ComposeMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
