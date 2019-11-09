import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RooperGameSheetComponent } from './rooper-game-sheet.component';

describe('RooperGameSheetComponent', () => {
  let component: RooperGameSheetComponent;
  let fixture: ComponentFixture<RooperGameSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RooperGameSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RooperGameSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
