import { GARAGE_URL, CURRENT_CAR_URL, OPTIONS_DELETE_CURRENT_CAR, ALL_CARS_URL } from './consts';
import store from './store';

export const getAllCars = async (page: number, limit: number) => {
  const request = await fetch(ALL_CARS_URL(page, limit));

  // store.cars = await request.json();
  store.carsNum = Number(request.headers.get('X-Total-Count'));
  return {
    cars: await request.json(),
    carsNum: Number(request.headers.get('X-Total-Count')),
  };
};

export const getCurrentCar = async (id: string) => {
  const request = await fetch(CURRENT_CAR_URL(id));
  const response = request.json();
  const carString = JSON.stringify(response);
  localStorage.setItem('currentCar', carString);

  return response;
};

export const updateCurrentCar = async (id: string, newName: string, newColor: string) => {
  const request = await fetch(CURRENT_CAR_URL(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, color: newColor }),
  });

  console.log(request.json());
};

export const deleteCurrentCar = async (id: string) => {
  const request = await fetch(CURRENT_CAR_URL(id), OPTIONS_DELETE_CURRENT_CAR);
  return request.json();
};

export const createCurrentCar = async (newName: string, newColor: string) => {
  const request = await fetch(GARAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, color: newColor }),
  });
  return request.json();
};
