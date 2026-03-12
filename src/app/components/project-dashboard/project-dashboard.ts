import {Component, computed, input} from '@angular/core';
import {TuiBadge} from '@taiga-ui/kit';
import {TuiCard, TuiHeader} from '@taiga-ui/layout';
import { TuiIcon, TuiTitle} from '@taiga-ui/core';
import {TuiPieChart} from '@taiga-ui/addon-charts';

@Component({
  selector: 'app-project-dashboard',
  imports: [
    TuiBadge,
    TuiCard,
    TuiHeader,
    TuiTitle,
    TuiIcon,
    TuiPieChart
  ],
  templateUrl: './project-dashboard.html',
  styleUrl: './project-dashboard.css',
})
export class ProjectDashboard {

  readonly tasks = input.required<any[]>();

  readonly todoTasks = computed(() => this.tasks().filter(t => t.status === 'A_FAIRE'));
  readonly inProgressTasks = computed(() => this.tasks().filter(t => t.status === "EN_COURS"));
  readonly doneTasks = computed(() => this.tasks().filter(t => t.status === 'TERMINE'));

  readonly chartValues = computed(() => [
    this.todoTasks().length,
    this.inProgressTasks().length,
    this.doneTasks().length,
  ]);

  readonly completionPercentage = computed(() => {
    const total = this.tasks().length;
    if(total === 0)return 0;
    return Math.round((this.doneTasks().length / total) * 100);
  });
  readonly highPriorityCount = computed(() =>
    this.tasks().filter(t => t.priorite === 'HAUTE').length
  );

  getPriorityStatus(priority: string): 'error' | 'warning' | 'info' {
    switch (priority) {
      case 'HAUTE': return 'error';
      case 'MOYENNE': return 'warning';
      default: return 'info';
    }
  }
}
