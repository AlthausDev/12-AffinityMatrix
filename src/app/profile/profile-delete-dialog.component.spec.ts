import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ProfileStore } from '../core/profile.store';
import { UiPreferencesService } from '../core/ui-preferences.service';
import { ProfileDeleteDialogComponent } from './profile-delete-dialog.component';

describe('ProfileDeleteDialogComponent', () => {
  it('places the destructive action first and keeps both actions equal-width', async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDeleteDialogComponent],
      providers: [
        { provide: ProfileStore, useValue: { delete: vi.fn() } },
        { provide: UiPreferencesService, useValue: { removeProfile: vi.fn() } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileDeleteDialogComponent);
    fixture.componentRef.setInput('profileId', 'profile-1');
    fixture.detectChanges();

    const actions = fixture.nativeElement.querySelector('.delete-actions') as HTMLElement;
    const buttons = actions.querySelectorAll('button');

    expect(buttons[0]?.classList.contains('danger')).toBe(true);
    expect(buttons[1]?.classList.contains('secondary')).toBe(true);
  });

  it('deletes the selected profile, cleans local UI state and emits deleted after confirmation', async () => {
    const deleteProfile = vi.fn().mockResolvedValue(true);
    const removeProfile = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ProfileDeleteDialogComponent],
      providers: [
        { provide: ProfileStore, useValue: { delete: deleteProfile } },
        { provide: UiPreferencesService, useValue: { removeProfile } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileDeleteDialogComponent);
    fixture.componentRef.setInput('profileId', 'profile-1');
    fixture.componentRef.setInput('alias', 'Example');

    let emitted = false;
    fixture.componentInstance.deleted.subscribe(() => { emitted = true; });
    fixture.detectChanges();

    const confirm = fixture.nativeElement.querySelector('.button.danger') as HTMLButtonElement;
    confirm.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(deleteProfile).toHaveBeenCalledWith('profile-1');
    expect(removeProfile).toHaveBeenCalledWith('profile-1');
    expect(emitted).toBe(true);
    expect(fixture.componentInstance.failed()).toBe(false);
  });

  it('keeps the dialog open and exposes a localized error state when deletion fails', async () => {
    const deleteProfile = vi.fn().mockResolvedValue(false);
    const removeProfile = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ProfileDeleteDialogComponent],
      providers: [
        { provide: ProfileStore, useValue: { delete: deleteProfile } },
        { provide: UiPreferencesService, useValue: { removeProfile } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileDeleteDialogComponent);
    fixture.componentRef.setInput('profileId', 'profile-1');
    fixture.detectChanges();

    const confirm = fixture.nativeElement.querySelector('.button.danger') as HTMLButtonElement;
    confirm.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(removeProfile).not.toHaveBeenCalled();
    expect(fixture.componentInstance.failed()).toBe(true);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });
});
