import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('application routes', () => {
  it('renders the questionnaire shell for a profile questionnaire route', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    fixture.detectChanges();
    expect(await router.navigateByUrl('/profiles/test-profile/questionnaire')).toBe(true);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-questionnaire-shell')).not.toBeNull();
  });
});
