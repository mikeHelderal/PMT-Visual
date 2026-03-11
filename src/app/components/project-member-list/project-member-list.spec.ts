import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMemberList } from './project-member-list';

describe('ProjectMemberList', () => {
  let component: ProjectMemberList;
  let fixture: ComponentFixture<ProjectMemberList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMemberList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectMemberList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
