import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyElementsComponent } from './my-elements.component';

describe('MyElementsComponent', () => {
  let component: MyElementsComponent;
  let fixture: ComponentFixture<MyElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyElementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
