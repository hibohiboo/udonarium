import { Component, OnDestroy, OnInit,HostListener, Input, } from '@angular/core';
import { EventSystem } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { TabletopService } from 'service/tabletop.service';
import { ContextMenuService, ContextMenuAction } from 'service/context-menu.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { TabletopActionService } from 'service/tabletop-action.service';
import { CoordinateService } from 'service/coordinate.service';
import { CounterBoard } from '../../class/counter-board';
import { CounterBoardService } from '../../service/counter-board.service'

const DETAIL_COUNT_NAME = 'カウント'

@Component({
  selector: 'counter-board-window',
  templateUrl: './counter-board-window.component.html',
  styleUrls: ['./counter-board-window.component.css'],
})
export class CounterBoardWindowComponent implements OnInit, OnDestroy {
  private _currentBoardIdentifier = '';
  private _currentBoard: CounterBoard | null = null;
  get currentBoard() : CounterBoard | null {
    if(this._currentBoard)return this._currentBoard;
    const [current] = this.counterBoardService.counterBoards
    return current;
  };
  get counterBoards() : CounterBoard[] {
    return  this.counterBoardService.counterBoards;
  };
  constructor(
    private panelService: PanelService,
    private modalService: ModalService,
    private tabletopService: TabletopService,
    private contextMenuService: ContextMenuService,
    private pointerDeviceService: PointerDeviceService,
    private tabletopActionService: TabletopActionService,
    private coordinateService: CoordinateService,
    private counterBoardService: CounterBoardService,
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.panelService.title = 'カウンターボード');
  }


  ngOnDestroy() { }

  addCounterBoard() {
    this._currentBoard = CounterBoard.create();
  }
  trackByBoard() {
    return this._currentBoardIdentifier;
  }
}
