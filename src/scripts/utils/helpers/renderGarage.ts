import Car from '../../components/car';

export const renderGarage = (data: Car[]): void => {
  const target: HTMLElement = document.getElementById('cars-root') as HTMLElement;

  data.map((item: Car) => {
    const car = new Car(item.name, item.color, item.id);

    target.innerHTML += car.render();

    return car;
  });
};
