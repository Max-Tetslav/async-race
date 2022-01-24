import IAnimationId from './iAnimationId';

export default interface IStore {
  cars: [];
  carsNum: number;
  garagePage: number;
  animation: Record<string, IAnimationId>;
}
