import { post } from 'axios';
import BaseHttpService from './base-http.service';

export default class AuthService extends BaseHttpService {
  async signin(name, password) {
    const result = await post(`${this.BASE_URL}/auth/signin`, { name, password });
    const accessToken = result.data.accessToken;
    this.saveToken(accessToken);
    return result.data.name;
  }

  async signup(name, password) {
    await post(`${this.BASE_URL}/auth/signup`, { name, password });
  }

  async signout() {
    this.removeToken();
  }
}
