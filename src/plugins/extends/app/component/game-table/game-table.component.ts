import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Card } from '@udonarium/card';
import { CardStack } from '@udonarium/card-stack';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { GameObject } from '@udonarium/core/synchronize-object/game-object';
import { EventSystem } from '@udonarium/core/system';
import { DiceSymbol } from '@udonarium/dice-symbol';
import { GameCharacter } from '@udonarium/game-character';
import { FilterType, GameTable, GridType } from '@udonarium/game-table';
import { GameTableMask } from '@udonarium/game-table-mask';
import { PeerCursor } from '@udonarium/peer-cursor';
import { TableSelecter } from '@udonarium/table-selecter';
import { Terrain } from '@udonarium/terrain';
import { TextNote } from '@udonarium/text-note';

import { GameTableSettingComponent } from 'component/game-table-setting/game-table-setting.component';
import { ContextMenuAction, ContextMenuSeparator, ContextMenuService } from 'service/context-menu.service';
import { CoordinateService } from 'service/coordinate.service';
import { ImageService } from 'service/image.service';
import { ModalService } from 'service/modal.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { TabletopActionService } from 'service/tabletop-action.service';
import { TabletopService } from 'service/tabletop.service';
import { is2d } from 'src/plugins/mode2d/extends/components/game-table/game-table.components';
import { offRotate } from 'src/plugins/rotate-off/extends/components/game-table/game-table.components';

import { GridLineRender } from 'src/app/component/game-table/grid-line-render';
import { TableMouseGesture } from 'src/app/component/game-table/table-mouse-gesture';
import { TableTouchGesture } from 'src/app/component/game-table/table-touch-gesture';
import { HandStorageService } from 'src/plugins/hand-storage/extend/service/hand-storage.service';
import { HandStorage } from 'src/plugins/hand-storage/extend/class/hand-storage';

@Component({
  selector: 'game-table-extend-plus',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css'],
})
export class GameTableComponentExtendPlus implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('root', { static: true }) rootElementRef: ElementRef<HTMLElement>;
  @ViewChild('gameTable', { static: true }) gameTable: ElementRef<HTMLElement>;
  @ViewChild('gameObjects', { static: true }) gameObjects: ElementRef<HTMLElement>;
  @ViewChild('gridCanvas', { static: true }) gridCanvas: ElementRef<HTMLCanvasElement>;

  get tableSelecter(): TableSelecter { return this.tabletopService.tableSelecter; }
  get currentTable(): GameTable { return this.tabletopService.currentTable; }

  get tableImage(): ImageFile {
    return this.imageService.getSkeletonOr(this.currentTable.imageIdentifier);
  }

  get backgroundImage(): ImageFile {
    return this.imageService.getEmptyOr(this.currentTable.backgroundImageIdentifier);
  }

  get backgroundFilterType(): FilterType {
    return this.currentTable.backgroundFilterType;
  }

  private isTableTransformMode: boolean = false;
  private isTableTransformed: boolean = false;

  get isPointerDragging(): boolean { return this.pointerDeviceService.isDragging; }

  private viewPotisonX: number = 100;
  private viewPotisonY: number = 0;
  private viewPotisonZ: number = 0;

  private viewRotateX: number = is2d ? 0 : 50;
  private viewRotateY: number = 0;
  private viewRotateZ: number = is2d ? 0 : 10;

  private mouseGesture: TableMouseGesture = null;
  private touchGesture: TableTouchGesture = null;

  get characters(): GameCharacter[] { return this.tabletopService.characters; }
  get tableMasks(): GameTableMask[] { return this.tabletopService.tableMasks; }
  get cards(): Card[] { return this.tabletopService.cards; }
  get cardStacks(): CardStack[] { return this.tabletopService.cardStacks; }
  get terrains(): Terrain[] { return this.tabletopService.terrains; }
  get textNotes(): TextNote[] { return this.tabletopService.textNotes; }
  get diceSymbols(): DiceSymbol[] { return this.tabletopService.diceSymbols; }
  get peerCursors(): PeerCursor[] { return this.tabletopService.peerCursors; }
  get handStorages(): HandStorage[] { return this.handStorageService.handStorages; }

  constructor(
    private ngZone: NgZone,
    private contextMenuService: ContextMenuService,
    private pointerDeviceService: PointerDeviceService,
    private coordinateService: CoordinateService,
    private imageService: ImageService,
    private tabletopService: TabletopService,
    private tabletopActionService: TabletopActionService,
    private modalService: ModalService,
    private handStorageService: HandStorageService,
  ) { }

  ngOnInit() {
    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', event => {
        if (event.data.identifier !== this.currentTable.identifier && event.data.identifier !== this.tableSelecter.identifier) return;
        console.log('UPDATE_GAME_OBJECT GameTableComponent ' + this.currentTable.identifier);

        this.setGameTableGrid(this.currentTable.width, this.currentTable.height, this.currentTable.gridSize, this.currentTable.gridType, this.currentTable.gridColor);
      })
      .on('DRAG_LOCKED_OBJECT', event => {
        this.isTableTransformMode = true;
        this.pointerDeviceService.isDragging = false;
        let opacity: number = this.tableSelecter.gridShow ? 1.0 : 0.0;
        this.gridCanvas.nativeElement.style.opacity = opacity + '';
      });
    this.tabletopActionService.makeDefaultTable();
    this.tabletopActionService.makeDefaultTabletopObjects();
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initializeTableTouchGesture();
      this.initializeTableMouseGesture();
    });
    this.cancelInput();

    this.setGameTableGrid(this.currentTable.width, this.currentTable.height, this.currentTable.gridSize, this.currentTable.gridType, this.currentTable.gridColor);
    this.setTransform(0, 0, 0, 0, 0, 0);
    this.coordinateService.tabletopOriginElement = this.gameObjects.nativeElement;
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
    this.mouseGesture.destroy();
    this.touchGesture.destroy();
  }

  initializeTableTouchGesture() {
    this.touchGesture = new TableTouchGesture(this.rootElementRef.nativeElement, this.ngZone);
    this.touchGesture.onstart = this.onTableTouchStart.bind(this);
    this.touchGesture.onend = this.onTableTouchEnd.bind(this);
    this.touchGesture.ongesture = this.onTableTouchGesture.bind(this);
    this.touchGesture.ontransform = this.onTableTouchTransform.bind(this);
  }

  initializeTableMouseGesture() {
    this.mouseGesture = new TableMouseGesture(this.rootElementRef.nativeElement);
    this.mouseGesture.onstart = this.onTableMouseStart.bind(this);
    this.mouseGesture.onend = this.onTableMouseEnd.bind(this);
    this.mouseGesture.ontransform = this.onTableMouseTransform.bind(this);
  }

  onTableTouchStart() {
    this.mouseGesture.cancel();
  }

  onTableTouchEnd() {
    this.cancelInput();
  }

  onTableTouchGesture() {
    this.cancelInput();
  }

  onTableTouchTransform(transformX: number, transformY: number, transformZ: number, rotateX: number, rotateY: number, rotateZ: number, event: string, srcEvent: TouchEvent | MouseEvent | PointerEvent) {
    if (!this.isTableTransformMode || document.body !== document.activeElement) return;

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu && this.contextMenuService.isShow) {
      this.ngZone.run(() => this.contextMenuService.close());
    }

    if (srcEvent.cancelable) srcEvent.preventDefault();

    //
    let scale = (1000 + Math.abs(this.viewPotisonZ)) / 1000;
    transformX *= scale;
    transformY *= scale;
    if (80 < rotateX + this.viewRotateX) rotateX += 80 - (rotateX + this.viewRotateX);
    if (rotateX + this.viewRotateX < 0) rotateX += 0 - (rotateX + this.viewRotateX);
    if (750 < transformZ + this.viewPotisonZ) transformZ += 750 - (transformZ + this.viewPotisonZ);

    this.setTransform(transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
    this.isTableTransformed = true;
  }

  onTableMouseStart(e: any) {
    if (e.target.contains(this.gameObjects.nativeElement) || e.button === 1 || e.button === 2) {
      this.isTableTransformMode = true;
    } else {
      this.isTableTransformMode = false;
      this.pointerDeviceService.isDragging = true;
      this.gridCanvas.nativeElement.style.opacity = 1.0 + '';
    }

    if (!document.activeElement.contains(e.target)) {
      this.removeSelectionRanges();
      this.removeFocus();
    }
  }

  onTableMouseEnd(e: any) {
    this.cancelInput();
  }

  onTableMouseTransform(transformX: number, transformY: number, transformZ: number, rotateX: number, rotateY: number, rotateZ: number, event: string, srcEvent: TouchEvent | MouseEvent | PointerEvent) {
    if (!this.isTableTransformMode || document.body !== document.activeElement) return;

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu && this.contextMenuService.isShow) {
      this.ngZone.run(() => this.contextMenuService.close());
    }

    if (srcEvent.cancelable) srcEvent.preventDefault();

    //
    let scale = (1000 + Math.abs(this.viewPotisonZ)) / 1000;
    transformX *= scale;
    transformY *= scale;

    this.setTransform(transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
    this.isTableTransformed = true;
  }

  cancelInput() {
    this.mouseGesture.cancel();
    this.isTableTransformMode = true;
    this.pointerDeviceService.isDragging = false;
    let opacity: number = this.tableSelecter.gridShow ? 1.0 : 0.0;
    this.gridCanvas.nativeElement.style.opacity = opacity + '';
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(e: any) {
    if (!document.activeElement.contains(this.gameObjects.nativeElement)) return;
    e.preventDefault();

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;

    let menuPosition = this.pointerDeviceService.pointers[0];
    let objectPosition = this.coordinateService.calcTabletopLocalCoordinate();
    let menuActions: ContextMenuAction[] = [];

    Array.prototype.push.apply(menuActions, this.tabletopActionService.makeDefaultContextMenuActions(objectPosition));
    menuActions.push(ContextMenuSeparator);
    menuActions.push({
      name: 'テーブル設定', action: () => {
        this.modalService.open(GameTableSettingComponent);
      }
    });
    this.contextMenuService.open(menuPosition, menuActions, this.currentTable.name);
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(e: MouseEvent) {
    this.isTableTransformed = false;
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(e: TouchEvent) {
    this.isTableTransformed = false;
  }

  @HostListener('document:contextmenu', ['$event'])
  onDocumentContextMenu(e: MouseEvent) {
    if (this.isTableTransformed && !this.pointerDeviceService.isAllowedToOpenContextMenu) e.preventDefault();
  }

  private setTransform(transformX: number, transformY: number, transformZ: number, rotateX: number, rotateY: number, rotateZ: number) {
    this.viewRotateX += rotateX;
    this.viewRotateY += rotateY;
    this.viewRotateZ += rotateZ;

    this.viewPotisonX += transformX;
    this.viewPotisonY += transformY;
    this.viewPotisonZ += transformZ;

    if (offRotate) {
      this.viewRotateX -= rotateX;
      this.viewRotateY -= rotateY;
      this.viewRotateZ -= rotateZ;
    } else if (is2d) {
      this.viewRotateX -= rotateX;
    }

    this.gameTable.nativeElement.style.transform = `translateZ(${this.viewPotisonZ.toFixed(4)}px) translateY(${this.viewPotisonY.toFixed(4)}px) translateX(${this.viewPotisonX.toFixed(4)}px) rotateY(${this.viewRotateY.toFixed(4)}deg) rotateX(${this.viewRotateX.toFixed(4) + 'deg) rotateZ(' + this.viewRotateZ.toFixed(4)}deg)`;
  }

  private setGameTableGrid(width: number, height: number, gridSize: number = 50, gridType: GridType = GridType.SQUARE, gridColor: string = '#000000e6') {
    this.gameTable.nativeElement.style.width = width * gridSize + 'px';
    this.gameTable.nativeElement.style.height = height * gridSize + 'px';

    let render = new GridLineRender(this.gridCanvas.nativeElement);
    render.render(width, height, gridSize, gridType, gridColor);

    let opacity: number = this.tableSelecter.gridShow ? 1.0 : 0.0;
    this.gridCanvas.nativeElement.style.opacity = opacity + '';
  }

  private removeSelectionRanges() {
    let selection = window.getSelection();
    if (!selection.isCollapsed) {
      selection.removeAllRanges();
    }
  }

  private removeFocus() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  trackByGameObject(index: number, gameObject: GameObject) {
    return gameObject.identifier;
  }
}