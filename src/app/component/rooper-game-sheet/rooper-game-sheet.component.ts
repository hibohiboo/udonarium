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
    this.modalService.title = this.panelService.title = this.messages['惨劇RoopeR管理'][this.appLang];
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
    if (!window.confirm(this.messages["カウンターをリセットします。よろしいですか？"][this.appLang])){
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
    if (!window.confirm(this.messages["キャラクターを蘇生します。よろしいですか？"][this.appLang])){
      return;
    }
    this.rooperCards.forEach(card=>{
      card.isDead = false;
    })
  }
  resetLocation(){
    if (!window.confirm(this.messages["キャラクターを初期配置に戻します。よろしいですか？"][this.appLang])){
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

  // カウンターの初期値
  private _currentDate: number = 1;
  private _maxDate: number = 5;
  private _loop: number = 4;
  private _expansionGauge: number = 0;

  // カウンター更新時機能
  // 現在日付
  get currentDate(): number {
    return this._currentDate;
  }
  set currentDate(value: number) {
    this._currentDate = value;
    updatePosition(this.messages['カウント'][this.appLang],this.tabletopService, this.messages['現在日数'][this.appLang], value, (i)=>i-1);
  }
  // 最大日付
  get maxDate(): number {
    return this._maxDate;
  }
  set maxDate(value: number) {
    this._maxDate = value;
    updatePosition(this.messages['カウント'][this.appLang],this.tabletopService, this.messages['最大日数'][this.appLang], value, (i)=>i);
  }

  // ループ回数
  get loop(): number {
    return this._loop;
  }
  set loop(value: number) {
    this._loop = value;
    updatePosition(this.messages['カウント'][this.appLang],this.tabletopService, this.messages['ループカウンター'][this.appLang], value, (i)=>7-i);
  }

  // 拡張ゲージ
  get expansionGauge(): number {
    return this._expansionGauge;
  }
  set expansionGauge(value: number) {
    this._expansionGauge = value;
    updatePosition(this.messages['カウント'][this.appLang], this.tabletopService, this.messages['Exカウンター'][this.appLang], value, (i)=>i);
  }

  // 多言語対応
  appLang = location.search.includes('lang=en') ? 'en' : 'ja';
  messages = {
    '日数': { ja: '日数',    en: 'Days'},
    '残ループ': { ja: '残ループ', en: 'Remaining Loops'},
    '拡張ゲージ': { ja: '拡張ゲージ', en: 'EX'},
    'キャラクター': { ja: 'キャラクター', en: 'Character'},
    'レイで追加されたトークンを使用する': { ja: 'レイで追加されたトークンを使用する', en: 'Use tokens added by Rei'},
    'カウンターリセット': { ja: 'カウンターリセット', en: 'Reset Counters'},
    '初期位置に配置': { ja: '初期位置に配置', en: 'Reset Positions'},
    '一括蘇生': { ja: '一括蘇生', en: 'Revive All'},
    '名前': { ja: '名前', en: 'Name'},
    '友好': { ja: '友好', en: 'Goodwill'},
    '不安': { ja: '不安', en: 'Paranoia'},
    '暗躍': { ja: '暗躍', en: 'Intrigue'},
    '希望': { ja: '希望', en: 'Hope'},
    '絶望': { ja: '絶望', en: 'Despair'},
    '死亡': { ja: '死亡', en: 'Dead'},
    '死亡済': { ja: '死亡済', en: 'Died'},
    '交友': { ja: '交友', en: 'Friendship'},
    '交友(拒否)': { ja: '交友(拒否)', en: 'Friendship (Rejected)'},
    '学校': { ja: '学校', en: 'School'},
    '病院': { ja: '病院', en: 'Hospital'},
    '神社': { ja: '神社', en: 'Shrine'},
    '都市': { ja: '都市', en: 'City'},
    'キャラクターを初期配置に戻します。よろしいですか？': { ja: 'キャラクターを初期配置に戻します。よろしいですか？', en: 'Reset character positions?'},
    'カウンターをリセットします。よろしいですか？': { ja: 'カウンターをリセットします。よろしいですか？', en: 'Reset counters?'},
    'キャラクターを蘇生します。よろしいですか？': { ja: 'キャラクターを蘇生します。よろしいですか？', en: 'Revive all characters?'},
    '惨劇RoopeR管理': { ja: '惨劇RoopeR管理', en: 'Rooper Management'},
    'キャラクターを追加': { ja: 'キャラクターを追加', en: 'Add Character'},
    '現在日数': { ja: '現在日数', en: 'Current Day'},
    '最大日数': { ja: '最大日数', en: 'Maximum Number of Days'},
    'ループカウンター': { ja: 'ループカウンター', en: 'Loop Counter'},
    'Exカウンター': { ja: 'Exカウンター', en: 'EX Gauge'},
    'カウント': { ja: 'カウント', en: 'Count'},
  }
}

function updatePosition(countName:string, tabletopService: TabletopService, name: string, value: number,locationCalc: (i:number)=>number){

  tabletopService.cards.forEach((obj) => {
      if(obj.name !== name) return;
      const [target] = obj.detailDataElement?.getFirstElementByName(countName)?.children;
      if (!target) return;
      (target as any).currentValue = value.toString();
      obj.location.y = getLocationY(locationCalc(value));
      obj.update();
    });
}

function getLocationY(i:number){
  switch(i){
    case 1: return 310;
    case 2: return 380;
    case 3: return 440;
    case 4: return 500;
    case 5: return 570;
    case 6: return 630;
    case 7: return 690;
    case 8: return 750;
    default: return 255;
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
