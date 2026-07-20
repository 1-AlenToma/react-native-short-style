
class CssStyleSheet {
  static create<T extends { key: any }>(path: `${string}.css`): { [key: string]: number } {
    return path as any;
  }

}

export default CssStyleSheet;