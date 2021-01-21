import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WithFlyContextMenuComponent } from './context-menu.component';

describe('WithFlyContextMenuComponent', () => {
  let component: WithFlyContextMenuComponent;
  let fixture: ComponentFixture<WithFlyContextMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WithFlyContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithFlyContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
