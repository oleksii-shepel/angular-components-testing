import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, ResponseOptions, STATUS, getStatusText } from 'angular-in-memory-web-api';

export interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class DataService implements InMemoryDbService {
  private url = 'api/users/';
  private users: User[] =  [
    {
      id: 1,
      username: 'testuser',
      password: 'testpassword'
    }
  ];

  constructor() { }

  createDb() {
    return {
      users: this.users
    };
  }

  post(reqInfo: RequestInfo) {
    var collection = reqInfo.collection;
    // process only requests as /api/users/
    if (!collection) {
      return reqInfo.utils.createResponse$(() => {
        const options: ResponseOptions = { status: STATUS.BAD_REQUEST };
        return this.finishOptions(options, reqInfo);
      });
    }

    // check if the collection contains an item with specified credentials
    let item = reqInfo.utils.getJsonBody(reqInfo.req) as User
    if(collection.some((user: User) => user.username === item.username && user.password === item.password)) {
      return reqInfo.utils.createResponse$(() => {
        const options: ResponseOptions = { body: item.username, status: STATUS.OK };
        return this.finishOptions(options, reqInfo);
      });
    } else {
      return reqInfo.utils.createResponse$(() => {
        const options: ResponseOptions = { status: STATUS.NOT_FOUND };
        return this.finishOptions(options, reqInfo);
      });
    }
  }

  genId(collection: any): number {
    return collection.length > 0 ? Math.max(...collection.map((user: User) => user.id)) + 1 : 1;
  }

  private finishOptions(options: ResponseOptions, { headers, url }: RequestInfo) {
    options.statusText = getStatusText(options.status!);
    options.headers = headers;
    options.url = url;
    return options;
  }
}
