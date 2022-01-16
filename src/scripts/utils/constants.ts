export const URL_ALL_CARS: string = 'http://127.0.0.1:3000/garage';
export const URL_CURRENT_CAR = (id: string): string => `http://127.0.0.1:3000/garage/${id}`;

export const OPTIONS_UPDATE_CURRENT_CAR = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const OPTIONS_DELETE_CURRENT_CAR = {
  method: 'DELETE',
};

export const OPTIONS_CREATE_CAR = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const DEFAULT_CAR_COLOR: string = '#000000';
