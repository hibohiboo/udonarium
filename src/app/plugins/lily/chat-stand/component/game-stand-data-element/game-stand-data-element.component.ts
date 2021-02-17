import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { EventSystem } from '@udonarium/core/system';
import { DataElement } from '@udonarium/data-element';
import { FileSelecterComponent } from 'component/file-selecter/file-selecter.component';
import { ModalService } from 'service/modal.service';
import config from 'src/app/plugins/config';
import factory from 'src/app/plugins/factory';

@Component({
  selector: 'game-stand-data-element, [game-stand-data-element]',
  templateUrl: './game-stand-data-element.component.html',
  styleUrls: ['./game-stand-data-element.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStandDataElementComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() gameDataElement: DataElement = null;
  @Input() isEdit: boolean = false;
  @Input() isTagLocked: boolean = false;
  @Input() isValueLocked: boolean = false;

  get useOpenUrl(): boolean { return config.useWithFlyOpenUrl }
  private _name: string = '';
  get name(): string { return this._name; }
  set name(name: string) { this._name = name; this.setUpdateTimer(); }

  private _value: number | string = 0;
  get value(): number | string { return this._value; }
  set value(value: number | string) { this._value = value; this.setUpdateTimer(); }

  private _currentValue: number | string = 0;
  get currentValue(): number | string { return this._currentValue; }
  set currentValue(currentValue: number | string) { this._currentValue = currentValue; this.setUpdateTimer(); }

  private updateTimer: NodeJS.Timer = null;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    if (this.gameDataElement) this.setValues(this.gameDataElement);

    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        if (this.gameDataElement && event.data.identifier === this.gameDataElement.identifier) {
          this.setValues(this.gameDataElement);
          this.changeDetector.markForCheck();
        }
      })
      .on('DELETE_GAME_OBJECT', -1000, event => {
        if (this.gameDataElement && this.gameDataElement.identifier === event.data.identifier) {
          this.changeDetector.markForCheck();
        }
      });
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  ngAfterViewInit() {

  }

  get imageFileUrl(): string {
    let image:ImageFile = ImageStorage.instance.get(<string>this.gameDataElement.value);
    if (image) return image.url;
    return '';
 }

 openModal(name: string = '', isAllowedEmpty: boolean = false) {
   this.modalService.open<string>(factory.storageSelectorComponentFactory(), { isAllowedEmpty: isAllowedEmpty }).then(value => {
     if (!value) return;
     let element = this.gameDataElement;
     if (!element) return;
     element.value = value;
   });
 }

  addImageElement() {
    this.gameDataElement.appendChild(DataElement.create('imageIdentifier', '', { type: 'image' }));
  }

  deleteImageElement() {
    if( this.gameDataElement.parent.children[0] != this.gameDataElement)    this.gameDataElement.destroy();
  }

  setElementType(type: string) {
    this.gameDataElement.setAttribute('type', type);
  }

  private setValues(object: DataElement) {
    this._name = object.name;
    this._currentValue = object.currentValue;
    this._value = object.value;
  }

  private setUpdateTimer() {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      if (this.gameDataElement.name !== this.name) this.gameDataElement.name = this.name;
      if (this.gameDataElement.currentValue !== this.currentValue) this.gameDataElement.currentValue = this.currentValue;
      if (this.gameDataElement.value !== this.value) this.gameDataElement.value = this.value;
      this.updateTimer = null;
    }, 66);
  }
}
