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

  async processImage(file: File, threshold: number) {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('threshold', threshold.toString());
    console.log('Sending file with confidenceThreshold:', threshold.toString());
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
