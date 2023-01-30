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


const DETAIL_COUNT_NAME = 'カウント'

@Component({
  selector: 'counter-board-window',
  templateUrl: './counter-board-window.component.html',
  styleUrls: ['./counter-board-window.component.css'],
})
export class CounterBoardWindowComponent implements OnInit, OnDestroy {
  currentBoard : CounterBoard | null = null;
  constructor(
    private panelService: PanelService,
    private modalService: ModalService,
    private tabletopService: TabletopService,
    private contextMenuService: ContextMenuService,
    private pointerDeviceService: PointerDeviceService,
    private tabletopActionService: TabletopActionService,
    private coordinateService: CoordinateService,
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.panelService.title = 'カウンターボード');
    if(!this.currentBoard){
      this.currentBoard = new CounterBoard();
      this.currentBoard.initialize();
    }
  }

  ngOnDestroy() { }


}
