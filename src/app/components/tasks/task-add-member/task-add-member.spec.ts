import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAddMember } from './task-add-member';

describe('TaskAddMember', () => {
  let component: TaskAddMember;
  let fixture: ComponentFixture<TaskAddMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAddMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAddMember);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
