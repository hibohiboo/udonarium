const _rightRotate = (rotate: number, just: boolean=false): number => {
  let tmp = rotate % 360;
  if (!just) {
    if (tmp > 180) {
      tmp = tmp - 360;
    } else if (tmp < -180) {
      tmp = tmp + 360;
    }
  }
  return tmp;
}

export const resetViewHandler = (that, event) => {
  that.isTableTransformMode = false;
  that.pointerDeviceService.isDragging = false;

  that.setTransform(that.viewPotisonX, that.viewPotisonY, that.viewPotisonZ, _rightRotate(that.viewRotateX), _rightRotate(that.viewRotateY, true), _rightRotate(that.viewRotateZ), true);
  setTimeout(() => {
    that.gridCanvas.nativeElement.style.opacity = '0.0';
    that.gameTable.nativeElement.style.transition = '0.1s ease-out';
    setTimeout(() => {
      that.gameTable.nativeElement.style.transition = null;
    }, 100);
    if (event && event.data == 'top') {
      that.setTransform(0, 0, 0, 0, 0, 0, true);
    } else {
      that.setTransform(100, 0, 0, 50, 0, 10, true);
    }
  }, 50);
  that.removeFocus();
}
