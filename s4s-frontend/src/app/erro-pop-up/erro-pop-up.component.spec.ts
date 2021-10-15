import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErroPopUpComponent } from './erro-pop-up.component';

describe('ErroPopUpComponent', () => {
  let component: ErroPopUpComponent;
  let fixture: ComponentFixture<ErroPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErroPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErroPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
