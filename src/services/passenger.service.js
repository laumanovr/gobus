import {sendGetRequest} from "@/services/api.service";

export class PassengerService {
  constructor() {
  }

  static fetchPassengerList(page=1) {
    const url = `users?limit=10&page=${page}`
    return sendGetRequest(url)
  }
}
