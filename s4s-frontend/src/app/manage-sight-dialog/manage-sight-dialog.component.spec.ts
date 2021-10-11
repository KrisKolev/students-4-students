import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSightDialogComponent } from './manage-sight-dialog.component';

describe('ManageSightDialogComponent', () => {
  let component: ManageSightDialogComponent;
  let fixture: ComponentFixture<ManageSightDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSightDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
