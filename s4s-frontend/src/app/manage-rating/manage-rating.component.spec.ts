import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRatingComponent } from './manage-rating.component';

describe('ManageRatingComponent', () => {
  let component: ManageRatingComponent;
  let fixture: ComponentFixture<ManageRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
