import { Component, OnDestroy, OnInit,HostListener, } from '@angular/core';
import { EventSystem } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { TabletopService } from 'service/tabletop.service';
import { ContextMenuService, ContextMenuAction } from 'service/context-menu.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import {Board } from '@udonarium/rooper-card';
import { TabletopActionService } from 'service/tabletop-action.service';

@Component({
  selector: 'rooper-game-sheet',
  templateUrl: './rooper-game-sheet.component.html',
  styleUrls: ['./rooper-game-sheet.component.css'],
})
export class RooperGameSheetComponent implements OnInit, OnDestroy {
  private _isRei: boolean = false;
  get rooperCards() {return this.tabletopService.rooperCards; };
  set isRei(v:boolean){
    this._isRei = v;
    const bias = 300;
    if(this._isRei){
      this.panelService.width += bias;
    }else{
      this.panelService.width -= bias;
    }
  };
  get isRei(){return this._isRei}
  constructor(
    private panelService: PanelService,
    private modalService: ModalService,
    private tabletopService: TabletopService,
    private contextMenuService: ContextMenuService,
    private pointerDeviceService: PointerDeviceService,
    private tabletopActionService: TabletopActionService,
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => this.changeTitle());
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

    let actions: ContextMenuAction[] = this.tabletopActionService.getCreateRooperSubSubMenu({x:900, y:400, z: 0});
    this.contextMenuService.open(position, actions);
  }
  resetCounter(){
    if (!window.confirm("カウンターをリセットします。よろしいですか？")){
      return;
    }
    this.rooperCards.forEach(card=>{
      card.goodwill = 0;
      card.paranoia = 0;
      card.intrigue = 0;
      card.hope = 0;
      card.despair = 0;
    })
  }
  reviveAll(){
    if (!window.confirm("キャラクターを蘇生します。よろしいですか？")){
      return;
    }
    this.rooperCards.forEach(card=>{
      card.isDead = false;
    })
  }
  resetLocation(){
    if (!window.confirm("キャラクターを初期配置に戻します。よろしいですか？")){
      return;
    }
    let numbers = {
      school: 0,
      hospital: 0,
      shrine: 0,
      city:0,
    };

    this.rooperCards.forEach(card=>{
      card.location.x = calcPositionX(card.defaultPosition, numbers);
      card.location.y = calcPositionY(card.defaultPosition, numbers);
      card.update();
      switch(card.defaultPosition){
        case '学校': return numbers.school++;
        case '病院': return numbers.hospital++;
        case '神社': return numbers.shrine++;
        case '都市': return numbers.city++;
      }
    })
  }
}

function calcPositionX(board:Board, numbers: {
  school: number,
  hospital: number,
  shrine: number,
  city:number,
}){
  const tick = 50;
  const board_left_edge_x = 5.5 * tick;
  const card_width = 3.5 * tick;

  switch(board){
    case '学校': return board_left_edge_x + 13.5 * tick + card_width * (numbers.school % 4);
    case '病院': return board_left_edge_x + card_width * (numbers.hospital % 4);
    case '神社': return board_left_edge_x + 13.5 * tick + card_width * (numbers.shrine % 4);
    case '都市': return board_left_edge_x+ card_width * (numbers.city % 4);
  }
}
function calcPositionY(board:Board,  numbers: {
  school: number,
  hospital: number,
  shrine: number,
  city:number,
}){
  const tick = 50;
  const base_y =  tick * 2;
  const card_height = 4.5 * tick;
  const under_padding = 10 * tick;

  switch(board){
    case '学校': return base_y + under_padding + Math.floor(numbers.school/4) * card_height;
    case '病院': return base_y + Math.floor(numbers.hospital/4) * card_height;
    case '神社': return base_y + Math.floor(numbers.shrine/4) * card_height;
    case '都市': return base_y + under_padding + Math.floor(numbers.city/4) * card_height;
  }
}
