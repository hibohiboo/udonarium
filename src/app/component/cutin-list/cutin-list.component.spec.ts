import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CutinListComponent } from './cutin-list.component';

describe('CutinListComponent', () => {
  let component: CutinListComponent;
  let fixture: ComponentFixture<CutinListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CutinListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CutinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
