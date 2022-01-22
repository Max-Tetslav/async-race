import { URL_ALL_CARS, URL_CURRENT_CAR, OPTIONS_DELETE_CURRENT_CAR } from './consts';

export const getAllCars = async () => {
  const request = await fetch(URL_ALL_CARS);
  return request.json();
};

export const getCurrentCar = async (id: string) => {
  const request = await fetch(URL_CURRENT_CAR(id));
  const response = request.json();
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
  
  console.log(request.json());
};

export const deleteCurrentCar = async (id: string) => {
  const request = await fetch(URL_CURRENT_CAR(id), OPTIONS_DELETE_CURRENT_CAR);
  return request.json();
};

export const createCurrentCar = async (newName: string, newColor: string) => {
  const request = await fetch(URL_ALL_CARS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, color: newColor }),
  });
  return request.json();
};
