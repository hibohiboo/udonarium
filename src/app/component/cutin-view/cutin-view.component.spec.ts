import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CutinComponent } from './cutin.component';

describe('CutinComponent', () => {
  let component: CutinComponent;
  let fixture: ComponentFixture<CutinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CutinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CutinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
