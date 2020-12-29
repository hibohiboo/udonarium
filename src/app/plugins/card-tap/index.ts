import type { CardComponent } from "component/card/card.component";

export default {
  cardPointerHook(card: {rotate: number}, e: PointerEvent){
    e.stopPropagation();
    e.preventDefault();
    // @ts-ignore
    card.elementRef.nativeElement.focus();
  },
  cardOnKeydownHook(card: {rotate: number}, e: KeyboardEvent){
    e.stopPropagation();
    e.preventDefault();
    if (e.key === 't') {
      card.rotate = 90;
      return true;
    }
    if (e.key === 'u') {
      card.rotate = 0;
      return true;
    }
    return false;
  }
}
