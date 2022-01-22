export default interface IRequestOptions {
  method: string;
  headers?: {
    [key: string]: string;
  };
  body?: {
    [key: string]: string;
  };
}
