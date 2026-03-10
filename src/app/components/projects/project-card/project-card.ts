import {Component, input, output} from '@angular/core';
import {TuiButton, TuiTitle} from '@taiga-ui/core';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import {Project} from '../../../models/project.model';

@Component({
  selector: 'app-project-card',
  imports: [TuiCardLarge, TuiButton, TuiTitle, TuiHeader],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {

  project = input.required<Project>()
  onDelete = output<number>()

}
