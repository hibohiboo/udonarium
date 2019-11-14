import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CutinViewComponent } from './cutin-view.component';

describe('CutinViewComponent', () => {
  let component: CutinViewComponent;
  let fixture: ComponentFixture<CutinViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CutinViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CutinViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
