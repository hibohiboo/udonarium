import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelecterComponentLily } from './file-selecter.component';

describe('FileSelecterComponentLily', () => {
  let component: FileSelecterComponentLily;
  let fixture: ComponentFixture<FileSelecterComponentLily>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSelecterComponentLily ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSelecterComponentLily);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
