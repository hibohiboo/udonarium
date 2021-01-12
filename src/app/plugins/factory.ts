import { EventEmitter } from '@angular/core'
import { FileSelecterComponent } from 'component/file-selecter/file-selecter.component'
import { FileStorageComponent } from 'component/file-storage/file-storage.component'
import config from './config'
import { FileSelecterComponentLily } from './lily/file/component/file-selecter/file-selecter.component'
import { FileStorageComponentLily } from './lily/file/component/file-storage/file-storage.component'

export default {
  storageComponentFactory() {
    if (config.useLilyFile) {
      return FileStorageComponentLily
    }
    return FileStorageComponent
  },
  storageSelectorComponentFactory() {
    if (config.useLilyFile) return FileSelecterComponentLily
    return FileSelecterComponent
  },
  chatInputEventEmitterFactory() {
    if (config.useLilyStand && config.useLilyMessageColor)
      return new EventEmitter<{
        text: string
        gameType: string
        sendFrom: string
        sendTo: string
        tachieNum: number
        messColor: string
      }>()
    if (config.useLilyStand)
      return new EventEmitter<{
        text: string
        gameType: string
        sendFrom: string
        sendTo: string
        tachieNum: number
      }>()
    if (config.useLilyMessageColor) return  new EventEmitter<{
      text: string
      gameType: string
      sendFrom: string
      sendTo: string
      messColor: string
    }>()
    return new EventEmitter<{
      text: string
      gameType: string
      sendFrom: string
      sendTo: string
    }>()
  },
  chatInputChatMessageFactory(that) {
    const retObj = {
      text: that.text,
      gameType: that.gameType,
      sendFrom: that.sendFrom,
      sendTo: that.sendTo,
    }

    if (config.useLilyStand && config.useLilyMessageColor) {
      return { ...retObj, tachieNum: that.tachieNum, messColor: that.selectChatColor }
    }

    if (config.useLilyStand) {
      console.log(
        '円柱TEST event: KeyboardEvent ' +
          that.sendFrom +
          '  ' +
          that.tachieNum,
      )
      return { ...retObj, tachieNum: that.tachieNum }
    }

    if (config.useLilyMessageColor) {
      return { ...retObj, messColor: that.selectChatColor }
    }

    return retObj
  },
}
