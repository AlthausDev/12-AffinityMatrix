import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ProfileStore } from '../core/profile.store';
import { ProfileDeleteDialogComponent } from './profile-delete-dialog.component';

describe('ProfileDeleteDialogComponent', () => {
  it('deletes the selected profile and emits deleted after confirmation', async () => {
    const deleteProfile = vi.fn().mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [ProfileDeleteDialogComponent],
      providers: [{ provide: ProfileStore, useValue: { delete: deleteProfile } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileDeleteDialogComponent);
    fixture.componentRef.setInput('profileId', 'profile-1');
    fixture.componentRef.setInput('alias', 'Example');

    let emitted = false;
    fixture.componentInstance.deleted.subscribe(() => { emitted = true; });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    buttons[1]?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(deleteProfile).toHaveBeenCalledWith('profile-1');
    expect(emitted).toBe(true);
    expect(fixture.componentInstance.failed()).toBe(false);
  });

  it('keeps the dialog open and exposes a localized error state when deletion fails', async () => {
    const deleteProfile = vi.fn().mockResolvedValue(false);

    await TestBed.configureTestingModule({
      imports: [ProfileDeleteDialogComponent],
      providers: [{ provide: ProfileStore, useValue: { delete: deleteProfile } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileDeleteDialogComponent);
    fixture.componentRef.setInput('profileId', 'profile-1');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    buttons[1]?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.failed()).toBe(true);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });
});
