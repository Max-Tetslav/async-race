import { DEFAULT_CAR_COLOR, HEX_COLOR_LENGTH, RGB_COLOR_COMBINATIONS_NUM } from '../consts';

export const getRandomHEX = (): string => {
  const color: string = '#' + Math.floor(Math.random() * RGB_COLOR_COMBINATIONS_NUM).toString(16);
  
  return color.length === HEX_COLOR_LENGTH ? color : DEFAULT_CAR_COLOR;
}