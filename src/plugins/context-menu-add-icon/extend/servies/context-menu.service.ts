import { ComponentRef } from "@angular/core";
import { ContextMenuService } from "service/context-menu.service";
import { pluginConfig } from "src/plugins/config";
import { ContextMenuComponentExtendPlus } from "src/plugins/extends/app/component/context-menu/context-menu.component";
import { ContextMenuAddIcons } from "../../constants";

export const openContextMenuWithIcons = (that, position, actions, title, parentViewContainerRef) => {
  if(!pluginConfig.isContextMenuIcon || title !== ContextMenuAddIcons) return false;
  that.close();
  if (!parentViewContainerRef) {
    parentViewContainerRef = ContextMenuService.defaultParentViewContainerRef;
    console.log('Context Open');
  }
  let panelComponentRef: ComponentRef<any>;

  const injector = parentViewContainerRef.injector;
  const panelComponentFactory = that.componentFactoryResolver.resolveComponentFactory(ContextMenuComponentExtendPlus);
  console.log(title, actions)
  console.log(title, that)
  panelComponentRef = parentViewContainerRef.createComponent(panelComponentFactory, parentViewContainerRef.length, injector);

  const childPanelService = panelComponentRef.injector.get(ContextMenuService) as any;

  childPanelService.panelComponentRef = panelComponentRef;
  if (actions) {
    childPanelService.actions = actions;
  }
  if (position) {
    childPanelService.position.x = position.x;
    childPanelService.position.y = position.y;
  }

  childPanelService.title = title != null ? title : '';

  panelComponentRef.onDestroy(() => {
    childPanelService.panelComponentRef = null;
  });
  return true;
}