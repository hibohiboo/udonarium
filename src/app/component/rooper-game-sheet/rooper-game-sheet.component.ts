import { Component, OnDestroy, OnInit,HostListener, } from '@angular/core';
import { EventSystem, Network } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { TabletopService } from 'service/tabletop.service';

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
}