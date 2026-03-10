import { TestBed } from '@angular/core/testing';

import { ProjectMember } from './project-member';

describe('ProjectMember', () => {
  let service: ProjectMember;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMember);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
