import { FileSelecterComponent } from 'component/file-selecter/file-selecter.component';
import { ContextMenuSeparator } from 'service/context-menu.service';
import { pluginConfig } from 'src/plugins/config';

export const cardBackImageAllChangeContextMenu = (that: any) =>
  pluginConfig.isCardBackImageAllChangeMenu
    ? [ContextMenuSeparator, changeImage(that)]
    : [];

const changeImage = (that: any) => {
  return {
    name: '裏画像を一括変更',
    action: () => {
      openModal(that, 'back');
    },
  };
};

const openModal = async (
  that: any,
  name: string = '',
  isAllowedEmpty: boolean = false,
) => {
  const value = await that.modalService.open(FileSelecterComponent, {
    isAllowedEmpty: isAllowedEmpty,
  });

  for (let card of that.cards) {
    if (!card || !card.imageDataElement || !value) continue;
    const element = card.imageDataElement.getFirstElementByName(name);
    if (!element) continue;
    element.value = value;
  }
};
