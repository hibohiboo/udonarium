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
  get currentBoard() : CounterBoard | null {
    const currentBoard = this.counterBoardService.counterBoards.find(item=>this._currentBoardIdentifier === item.identifier);
    if(currentBoard) return currentBoard;
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
    const board = CounterBoard.create();
    this._currentBoardIdentifier = board.identifier;
  }
  trackByBoard() {
    return this._currentBoardIdentifier;
  }
}
