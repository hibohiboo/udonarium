import { SyncObject, SyncVar } from '@udonarium/core/synchronize-object/decorator';
import { GameObject, ObjectContext } from '@udonarium/core/synchronize-object/game-object';
import { EventSystem } from '@udonarium/core/system';
import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { CutIn } from './cut-in';

@SyncObject('cut-in-launcher')
export class CutInLauncher extends GameObject {

  @SyncVar() test: string = 'test001';
  @SyncVar() launchCutInIdentifier: string  = '';
  @SyncVar() launchTimeStamp: number = 0;
  @SyncVar() launchIsStart: boolean = false;
  @SyncVar() stopBlankTagCutInTimeStamp: number = 0;

  reloadDummy : number = 5;

  startCutIn( cutIn : CutIn ){
    this.launchCutInIdentifier = cutIn.identifier;
    this.launchIsStart = true;
    this.launchTimeStamp = this.launchTimeStamp + 1;

    this.startSelfCutIn();
  }

  stopCutIn( cutIn : CutIn ){
    this.launchCutInIdentifier = cutIn.identifier;
    this.launchIsStart = false;
    this.launchTimeStamp = this.launchTimeStamp + 1;

    this.stopSelfCutIn();
  }

  stopBlankTagCutIn( ){
    this.stopBlankTagCutInTimeStamp = this.stopBlankTagCutInTimeStamp + 1;
    EventSystem.trigger('STOP_CUT_IN_BY_BGM', {  });
  }



  sameTagCutIn( cutIn : CutIn ): CutIn[] {

    let cutIns = this.getCutIns() ;
    let tagName = cutIn.tagName;
    let sameTagCutIn : CutIn[] = [];
    for ( let cutIn_ of cutIns ){
      if( cutIn_.tagName == tagName && cutIn_.identifier !== cutIn.identifier){
        sameTagCutIn.push( cutIn_ );
      }
    }
    return sameTagCutIn;
  }

  startSelfCutIn( ){
    let cutIn_ = ObjectStore.instance.get(this.launchCutInIdentifier);
    EventSystem.trigger('START_CUT_IN', { cutIn : cutIn_ });
  }

  stopSelfCutIn( ){
    let cutIn_ = ObjectStore.instance.get(this.launchCutInIdentifier);
    EventSystem.trigger('STOP_CUT_IN', { cutIn : cutIn_ });
  }



  stopSelfCutInByIdentifier( identifier : string ){
    let cutIn_ = ObjectStore.instance.get( identifier );
    EventSystem.trigger('STOP_CUT_IN', { cutIn : cutIn_ });
  }

  getCutIns(): CutIn[] {
    return ObjectStore.instance.getObjects(CutIn);
  }


  // GameObject Lifecycle
  onStoreAdded() {
    super.onStoreAdded();
  }

  // GameObject Lifecycle
  onStoreRemoved() {
    super.onStoreRemoved();
  }


  // override
  apply(context: ObjectContext) {
    console.log('CutInLauncher apply() CALL');

    let launchCutInIdentifier = this.launchCutInIdentifier;
    let launchIsStart = this.launchIsStart;
    let launchTimeStamp = this.launchTimeStamp;
    let stopBlankTagCutInTimeStamp = this.stopBlankTagCutInTimeStamp;

    super.apply(context);

    if( launchCutInIdentifier !== this.launchCutInIdentifier ||
        launchIsStart !== this.launchIsStart ||
        launchTimeStamp !== this.launchTimeStamp ){
      if( this.launchIsStart ){
        this.startSelfCutIn();
      }else{
        this.stopSelfCutIn();
      }
    }
    if( stopBlankTagCutInTimeStamp !== this.stopBlankTagCutInTimeStamp ){
      console.log('データ伝搬で検知 無タグカットイン停止のトリガー');
      EventSystem.trigger('STOP_CUT_IN_BY_BGM', {  });
    }

  }

}