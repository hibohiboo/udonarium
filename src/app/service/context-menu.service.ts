import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
// aotでコンパイルした後のファイルでContextMenuService.UIPanelComponentClassにnullが入っており、右クリック時に、e.resolveComponentFactoryにnullが入ってCannot read property 'ɵcmp' of nullになってしまう
// 循環参照のWARNINGが出るが、一旦、これで対策
import { ContextMenuComponent } from 'component/context-menu/context-menu.component';

interface ContextMenuPoint {
  x: number,
  y: number
}

export enum ContextMenuType {
  ACTION = 'action',
  SEPARATOR = 'separator',
}

export const ContextMenuSeparator: ContextMenuAction = {
  name: '',
  enabled: true,
  type: ContextMenuType.SEPARATOR
}

export interface ContextMenuAction {
  name: string,
  action?: Function,
  enabled?: boolean,
  type?: ContextMenuType,
  subActions?: ContextMenuAction[]
}

@Injectable()
export class ContextMenuService {
  /* Todo */
  static defaultParentViewContainerRef: ViewContainerRef;
  static UIPanelComponentClass: { new(...args: any[]): any } = null;

  private panelComponentRef: ComponentRef<any>

  title: string = '';
  actions: ContextMenuAction[] = [];
  position: ContextMenuPoint = { x: 0, y: 0 };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  get isShow(): boolean {
    return this.panelComponentRef ? true : false;
  }

  open(position: ContextMenuPoint, actions: ContextMenuAction[], title?: string, parentViewContainerRef?: ViewContainerRef) {
    this.close();
    if (!parentViewContainerRef) {
      parentViewContainerRef = ContextMenuService.defaultParentViewContainerRef;
      console.log('Context Open');
    }
    let panelComponentRef: ComponentRef<any>;

    const injector = parentViewContainerRef.injector;
    const panelComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ContextMenuComponent);

    panelComponentRef = parentViewContainerRef.createComponent(panelComponentFactory, parentViewContainerRef.length, injector);

    const childPanelService: ContextMenuService = panelComponentRef.injector.get(ContextMenuService);

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
  }

  close() {
    if (this.panelComponentRef) {
      this.panelComponentRef.destroy();
      this.panelComponentRef = null;
    }
  }
}
