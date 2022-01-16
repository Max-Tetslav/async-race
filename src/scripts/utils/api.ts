import { URL_ALL_CARS, URL_CURRENT_CAR, OPTIONS_DELETE_CURRENT_CAR } from './constants';

export const getAllCars = async () => {
  const request = await fetch(URL_ALL_CARS);
  const response = await request.json();

  return response;
};

export const getCurrentCar = async (id: string) => {
  const request = await fetch(URL_CURRENT_CAR(id));
  const response = await request.json();
  const carString = JSON.stringify(response);
  localStorage.setItem('currentCar', carString);

  return response;
};

export const updateCurrentCar = async (id: string, newName: string, newColor: string) => {
  const request = await fetch(URL_CURRENT_CAR(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, color: newColor }),
  });
  const response = await request.json();

  console.log(response);
  // return response;
};

export const deleteCurrentCar = async (id: string) => {
  const request = await fetch(URL_CURRENT_CAR(id), OPTIONS_DELETE_CURRENT_CAR);
  const response = await request.json();

  return response;
};

export const createCurrentCar = async (newName: string, newColor: string) => {
  const request = await fetch(URL_ALL_CARS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, color: newColor }),
  });
  const response = await request.json();

  return response;
};
