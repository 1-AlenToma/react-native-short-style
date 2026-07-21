
class CssStyleSheet {
  static create<T extends { key: any }>(cssFilePathOrCssString: string): { [key: string]: number } {
    return cssFilePathOrCssString as any;
  }

}

export default CssStyleSheet;