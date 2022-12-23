export namespace Device {
  export function isMobile(): boolean {
    return screen.availWidth < 768;
  }
}