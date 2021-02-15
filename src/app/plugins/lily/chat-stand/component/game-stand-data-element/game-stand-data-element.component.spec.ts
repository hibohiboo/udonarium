import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameStandDataElementComponent } from './game-stand-data-element.component';

describe('GameStandDataElementComponent', () => {
  let component: GameStandDataElementComponent;
  let fixture: ComponentFixture<GameStandDataElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameStandDataElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStandDataElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
