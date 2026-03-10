import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TaskService} from '../../../services/task/task-service';
import {Task} from '../../../models/task.model';
import { TuiTable } from '@taiga-ui/addon-table';
import {TaskForm} from '../../tasks/task-form/task-form';
import {TaskItem} from '../../tasks/task-item/task-item';
@Component({
  selector: 'app-project-detail',
  imports: [
    TuiTable,
    TaskForm,
    TaskItem

  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  projectId = Number(this.route.snapshot.paramMap.get('id'));
  tasks = signal<Task[]>([])

  ngOnInit() {
    this.taskService.getTasksByProject(this.projectId).subscribe(
      data => this.tasks.set(data)
    );
  }

  onTaskCreated(newTask: Task){
    this.tasks.update(currentTasks => [...currentTasks, newTask]);
  }

  removeTaskFromList(taskId: number){
    this.tasks.update(list => list.filter(t => t.id !== taskId))
  }

}
