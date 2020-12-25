import type { CardComponent } from "component/card/card.component";

export default {
  cardPointerHook(card: CardComponent, e: PointerEvent){
    e.stopPropagation();
    e.preventDefault();
    // @ts-ignore
    card.elementRef.nativeElement.focus();
  },
  cardOnKeydownHook(card: CardComponent, e: KeyboardEvent){
    e.stopPropagation();
    e.preventDefault();
    if (e.key === 't') {
      card.card.rotate = 90;
      return;
    }
    if (e.key === 'u') {
      card.rotate = 0;
      return;
    }
  }
}
