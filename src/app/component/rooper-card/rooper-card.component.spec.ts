import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RooperCardComponent } from './rooper-card.component';

describe('RooperCardComponent', () => {
  let component: RooperCardComponent;
  let fixture: ComponentFixture<RooperCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RooperCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RooperCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
