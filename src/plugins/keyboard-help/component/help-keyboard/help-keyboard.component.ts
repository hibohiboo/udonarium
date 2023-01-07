import { Component, OnDestroy, OnInit, HostListener } from '@angular/core'
import { EventSystem, Network } from '@udonarium/core/system'
import { ModalService } from 'service/modal.service'
import { PanelService } from 'service/panel.service'

@Component({
  selector: 'help-keyboard',
  templateUrl: './help-keyboard.component.html',
  styleUrls: ['./help-keyboard.component.css'],
})
export class HelpKeyboardComponent implements OnInit, OnDestroy {
  constructor(
    private panelService: PanelService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    Promise.resolve().then(() => this.modalService.title = this.panelService.title = 'ヘルプ');
  }

  ngOnDestroy() {
    EventSystem.unregister(this)
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    console.log('keyboard ', 'test')
    if (document.body !== document.activeElement) return

    if (e.key === 'Escape') {
      this.modalService.resolve()
      return
    }
  }
}
