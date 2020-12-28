import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStorageComponentLily } from './file-storage.component';

describe('FileStorageComponentLily', () => {
  let component: FileStorageComponentLily;
  let fixture: ComponentFixture<FileStorageComponentLily>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileStorageComponentLily ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileStorageComponentLily);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
