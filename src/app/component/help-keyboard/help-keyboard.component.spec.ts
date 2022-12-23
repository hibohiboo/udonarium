import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpKeyboardComponent } from './help-keyboard.component';

describe('HelpKeyboardComponent', () => {
  let component: HelpKeyboardComponent;
  let fixture: ComponentFixture<HelpKeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpKeyboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
