import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingComponentComponent } from './rating-component.component';

describe('RatingComponentComponent', () => {
  let component: RatingComponentComponent;
  let fixture: ComponentFixture<RatingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
