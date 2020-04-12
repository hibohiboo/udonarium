import { Component, OnDestroy, OnInit,HostListener, } from '@angular/core';
import { EventSystem } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { TabletopService } from 'service/tabletop.service';
import { ContextMenuService, ContextMenuAction } from 'service/context-menu.service';
import { PointerDeviceService } from 'service/pointer-device.service';

@Component({
  selector: 'rooper-game-sheet',
  templateUrl: './rooper-game-sheet.component.html',
  styleUrls: ['./rooper-game-sheet.component.css'],
})
export class RooperGameSheetComponent implements OnInit, OnDestroy {
  get rooperCards() {return this.tabletopService.rooperCards; };
  constructor(
    private panelService: PanelService,
    private modalService: ModalService,
    private tabletopService: TabletopService,
    private contextMenuService: ContextMenuService,
    private pointerDeviceService: PointerDeviceService
  ) { }

  ngOnInit() {
    this.changeTitle();
  }

  private changeTitle() {
    this.modalService.title = this.panelService.title = '惨劇RoopeR管理';
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  @HostListener("document:keydown", ["$event"])
  onKeydown(e: KeyboardEvent) {
    if (document.body !== document.activeElement) return;

    if (e.key === 'Escape') {
      this.modalService.resolve();
      return;
    }
  }
  addRooperCard(){
    let position = this.pointerDeviceService.pointers[0];

    let actions: ContextMenuAction[] = this.tabletopService.getCreateRooperSubSubMenu({x:900, y:400, z: 0});
    this.contextMenuService.open(position, actions);
  }
  resetCounter(){
    this.rooperCards.forEach(card=>{
      card.goodwill = 0;
      card.paranoia = 0;
      card.intrigue = 0;
    })
  }
  resetLocation(){
    this.rooperCards.forEach(card=>{
      card.location.x = 0;
      card.location.y = 0;
      card.update();
    })
  }
}
