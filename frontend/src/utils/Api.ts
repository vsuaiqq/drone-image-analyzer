import { API_URL } from './constants';

class Api {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async _checkStatus(response: Response) {
    if (response.ok) {
      return response;
    }
    return response.json().then(err => Promise.reject(err));
  }

  async processImage(file: File) {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(res => {
        return this._checkStatus(res);
      });
  }
  
};

const api = new Api(API_URL);

export default api;
