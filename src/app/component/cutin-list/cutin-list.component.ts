import { Component, OnDestroy, OnInit,HostListener,ComponentFactoryResolver } from '@angular/core';
import { EventSystem } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { TabletopService } from 'service/tabletop.service';
import { ContextMenuService, ContextMenuAction } from 'service/context-menu.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { Cutin } from '@udonarium/cutin';
import { CutinView } from '@udonarium/cutin-view';
import { CutinViewComponent } from "component/cutin-view/cutin-view.component";
import { OverviewPanelComponent } from 'component/overview-panel/overview-panel.component';

@Component({
  selector: 'cutin-list',
  templateUrl: './cutin-list.component.html',
  styleUrls: ['./cutin-list.component.css'],
})
export class CutinListComponent implements OnInit, OnDestroy {
  get cutins() { return this.tabletopService.cutins; }
  constructor(
    private panelService: PanelService,
    private modalService: ModalService,
    private tabletopService: TabletopService,
    private contextMenuService: ContextMenuService,
    private pointerDeviceService: PointerDeviceService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.changeTitle());
  }

  private changeTitle() {
    this.modalService.title = this.panelService.title = 'カットイン一覧';
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
  open (cutin:Cutin) {
    const cutinComponent = CutinView.create(cutin);
  }
}
