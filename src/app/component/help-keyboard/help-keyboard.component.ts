import { Component, OnDestroy, OnInit,HostListener, } from '@angular/core';
import { EventSystem, Network } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';

@Component({
  selector: 'help-keyboard',
  templateUrl: './help-keyboard.component.html',
  styleUrls: ['./help-keyboard.component.css'],
})
export class HelpKeyboardComponent implements OnInit, OnDestroy {
  constructor(
    private panelService: PanelService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.changeTitle();
  }

  private changeTitle() {
    this.modalService.title = this.panelService.title = 'キーボードショートカット';
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