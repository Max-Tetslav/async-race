import { CAR_BRAND_NAMES, CAR_MODEL_NAMES, DEFAULT_CAR_COLOR } from './constants';

export const getCarID = (elementID: string): string => {
  const carID: string = elementID.split('-')[1];

  return carID;
};

export const getRandomHEX = (): string => {
  const color: string = '#' + Math.floor(Math.random() * 16777215).toString(16);

  return color.length === 7 ? color : DEFAULT_CAR_COLOR;
}

export const getRandomName = (): string => {
  const randomBrand: number = Math.floor(Math.random() * 10);
  const randomModel: number = Math.floor(Math.random() * 10);

  return `${CAR_BRAND_NAMES[randomBrand]} ${CAR_MODEL_NAMES[randomModel]}`;
}
