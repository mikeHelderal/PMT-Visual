import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastContainer } from './toast-container';
import { NotificationsService } from '../../../services/notifications/notifications';
import { By } from '@angular/platform-browser';

describe('ToastContainer', () => {
  let component: ToastContainer;
  let fixture: ComponentFixture<ToastContainer>;
  let service: NotificationsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainer],
      providers: [NotificationsService]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainer);
    component = fixture.componentInstance;
    service = TestBed.inject(NotificationsService);
    fixture.detectChanges();
  });

  it('devrait afficher les toasts présents dans le service', () => {
    service.toasts.set([{ id: 1, message: 'Test Message', type: 'success' }]);
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast-item'));
    expect(toastElement).toBeTruthy();
    expect(toastElement.nativeElement.textContent).toContain('Test Message');
    expect(toastElement.nativeElement.classList).toContain('success');
  });

  it('devrait appeler remove() quand on clique sur un toast', () => {
    const spy = jest.spyOn(service, 'remove');
    service.toasts.set([{ id: 99, message: 'Click me', type: 'info' }]);
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast-item'));
    toastElement.nativeElement.click();

    expect(spy).toHaveBeenCalledWith(99);
  });
});
