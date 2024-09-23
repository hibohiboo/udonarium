import { Component, OnDestroy, OnInit } from '@angular/core';
import { PanelService } from 'service/panel.service';
import { CounterBoard } from '../../class/counter-board';
import { CounterBoardService } from '../../service/counter-board.service';

@Component({
  selector: 'counter-board-window',
  templateUrl: './counter-board-window.component.html',
  styleUrls: ['./counter-board-window.component.css'],
})
export class CounterBoardWindowComponent implements OnInit, OnDestroy {
  private _currentBoardIdentifier = '';
  get currentBoard(): CounterBoard | null {
    const currentBoard = this.counterBoardService.counterBoards.find(
      (item) => this._currentBoardIdentifier === item.identifier,
    );
    if (currentBoard) return currentBoard;
    const [current] = this.counterBoardService.counterBoards;
    return current;
  }

  get currentBoardIdentifier(): string {
    return this._currentBoardIdentifier;
  }
  set currentBoardIdentifier(identifier: string) {
    this._currentBoardIdentifier = identifier;
  }
  get counterBoards(): CounterBoard[] {
    return this.counterBoardService.counterBoards;
  }
  constructor(
    private panelService: PanelService,
    private counterBoardService: CounterBoardService,
  ) {}

  ngOnInit() {
    Promise.resolve().then(
      () => (this.panelService.title = 'カウンターボード'),
    );
  }

  ngOnDestroy() {}

  addCounterBoard() {
    const board = CounterBoard.create();
    this._currentBoardIdentifier = board.identifier;
  }
  trackByBoard() {
    return this._currentBoardIdentifier;
  }
}
