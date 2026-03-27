import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectStateService {

  protected _project = signal<any>(null);

  protected _userId = signal<number | null>(null);

  setProject(project: any) {
    this._project.set(project);}
  setUserId(id: number) { this._userId.set(id)}

  currentMember = computed(() => {
    const p = this._project();
    const uid = this._userId();
    if (!p || !uid) return null;
    return p.membres?.find((m: any) => m.user.id === uid) || null;
  });

  memberId = computed(() => this.currentMember()?.id);

  role = computed(() => this.currentMember()?.role?.libelle || 'GUEST');



}
