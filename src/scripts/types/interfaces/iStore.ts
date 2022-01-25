import IAnimationId from './iAnimationId';
import ICar from './iCar';
import ICarResult from './iCarResult';

export default interface IStore {
  cars: ICar[] | [];
  currentCar: ICar | {};
  winner: ICarResult | {};
  carsNum: number;
  garagePage: number;
  animation: Record<string, IAnimationId>;
  promises: ICarResult[];
}
