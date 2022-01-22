import { CAR_BRAND_NAMES, CAR_MODEL_NAMES } from '../consts';

export const getRandomCarName = (): string => {
  const randomBrand: number = Math.floor(Math.random() * 10);
  const randomModel: number = Math.floor(Math.random() * 10);

  return `${CAR_BRAND_NAMES[randomBrand]} ${CAR_MODEL_NAMES[randomModel]}`;
}
