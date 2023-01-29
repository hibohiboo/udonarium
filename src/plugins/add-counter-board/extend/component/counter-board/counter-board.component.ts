import { Component, OnDestroy, OnInit,HostListener, } from '@angular/core';
import { EventSystem } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { TabletopService } from 'service/tabletop.service';
import { ContextMenuService, ContextMenuAction } from 'service/context-menu.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { TabletopActionService } from 'service/tabletop-action.service';

@Component({
  selector: 'counter-board',
  templateUrl: './counter-board.component.html',
  styleUrls: ['./counter-board.component.css'],
})
export class CounterBoardComponent implements OnInit, OnDestroy {
  get size () { return 50; }
  constructor(
    private panelService: PanelService,
    private modalService: ModalService,
    private tabletopService: TabletopService,
    private contextMenuService: ContextMenuService,
    private pointerDeviceService: PointerDeviceService,
    private tabletopActionService: TabletopActionService,
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.panelService.title = 'カウンターボード');
  }

  ngOnDestroy() {
  }
  get objects() {
    const size = this.size;
    return this.tabletopService.terrains.map(obj=> {
     const countElement = obj.detailDataElement.getFirstElementByName('カウント');
     const count = Number(countElement.value);
     console.log('countElement.value',countElement.value)
     return {
              name: obj.name
            , count
            , increaseCount() {
                const newValue = count + 1;

                countElement.value = `${newValue}`
                updatePosition(obj, newValue, size);
              }
            , decreaseCount() {
              const newValue = count - 1;
              countElement.value = `${newValue}`;
              updatePosition(obj, newValue, size);
            }
          }
    })
  }
}

const updatePosition  = (obj, count, size) => {
  console.log('coutn', count);
  console.log('size',size)
  obj.location.x = (count - 1) * size;
  console.log('update', obj);
  obj.update();
}
