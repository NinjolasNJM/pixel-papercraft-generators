import { type TextureInputControlProps } from "./modelControls";
import { type Model } from "./model";
import { type Region, type RegionLegacy } from "./renderers/types";
import { type DrawTextureOptions, drawTexture } from "./renderers/drawTexture";
import { type TabOrientation, drawTab } from "./renderers/drawTab";
import { type Page, makePage } from "./modelPage";
import { type Rectangle } from "./renderers/types";

export class Generator {
  model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  getCurrentPage(): Page {
    const currentPage = this.model.currentPage;
    if (currentPage) {
      return currentPage;
    }

    const page = makePage("Page");
    this.model.addPage(page);
    this.model.setCurrentPage(page);
    return page;
  }

  defineTextureInput(id: string, props: TextureInputControlProps): void {
    this.model.addTextureControl(id, props);
  }

  defineBooleanInput(id: string, initialValue: boolean): void {
    this.model.addBooleanControl(id, initialValue);
  }

  defineSelectInput(id: string, options: string[]): void {
    this.model.addSelectControl(id, options);
  }

  defineRegionInput(region: Region, onClick: () => void): void {
    const currentPage = this.getCurrentPage();
    this.model.addRegionControl(currentPage.id, region, onClick);
  }

  defineText(text: string): void {
    this.model.addTextControl(text);
  }

  getBooleanInputValue(id: string): boolean | null {
    return this.model.getBooleanVariable(id);
  }

  getBooleanInputValueWithDefault(id: string, defaultValue: boolean): boolean {
    return this.model.getBooleanVariable(id) ?? defaultValue;
  }

  setBooleanInputValue(id: string, value: boolean): void {
    this.model.setBooleanVariable(id, value);
  }

  getSelectInputValue(id: string): string | null {
    return this.model.getStringVariable(id);
  }

  setNumberVariable(id: string, value: number): void {
    this.model.setNumberVariable(id, value);
  }

  getNumberVariable(id: string): number | null {
    return this.model.getNumberVariable(id);
  }

  drawImage(id: string, [x, y]: [number, number]): void {
    const page = this.getCurrentPage();
    const image = this.model.findImage(id);

    if (!image) {
      return;
    }

    page.canvasWithContext.context.drawImage(image.image, x, y);
  }

  drawTexture(
    id: string,
    [sx, sy, sw, sh]: Region,
    [dx, dy, dw, dh]: Region,
    { flip, rotate, blend, pixelate }: DrawTextureOptions = {}
  ): void {
    const currentPage = this.getCurrentPage();
    const texture = this.model.findTexture(id);

    if (!texture) {
      return;
    }

    drawTexture(
      currentPage.canvasWithContext,
      texture,
      [sx, sy, sw, sh],
      [dx, dy, dw, dh],
      {
        flip,
        rotate,
        blend,
        pixelate,
      }
    );
  }

  drawTextureLegacy(
    id: string,
    { x: sx, y: sy, w: sw, h: sh }: RegionLegacy,
    { x: dx, y: dy, w: dw, h: dh }: RegionLegacy,
    options?: DrawTextureOptions
  ): void {
    this.drawTexture(id, [sx, sy, sw, sh], [dx, dy, dw, dh], options);
  }

  drawTab(
    rectangle: Rectangle,
    orientation: TabOrientation,
    showFoldLine?: boolean,
    tabAngle?: number
  ): void {
    const currentPage = this.getCurrentPage();
    drawTab(
      currentPage.canvasWithContext,
      rectangle,
      orientation,
      showFoldLine,
      tabAngle
    );
  }
}
