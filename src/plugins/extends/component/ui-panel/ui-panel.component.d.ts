import { UIPanelComponent as OriginalAppComponent } from 'src/app/component/ui-panel/ui-panel.component';

declare module 'src/app/component/ui-panel/ui-panel.component' {
  interface UIPanelComponent {
    isMinimized: boolean;
    isAbleMinimizeButton: boolean;
    toggleMinimize: () => {}
  }
}
