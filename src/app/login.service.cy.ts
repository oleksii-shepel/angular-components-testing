import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { LoginService } from './login.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DataService } from './data.service';

describe('LoginService', () => {
  it('should return a user if logged in', async() => {
    cy.intercept('POST', '/auth', {
      status: 200,
      message: 'testuser'
    }).then(async () => {
      TestBed.configureTestingModule({
        providers: [LoginService],
        imports: [HttpClientModule],
      });

      const loginService = TestBed.inject(LoginService);
      const res = await firstValueFrom(loginService.login('testuser', 'testpassword'));

      expect(res).deep.eq({
        status: 200,
        message: 'testuser'
      });
    });
  });

  it('should return a user with in-memory-web-api if logged in', async () => {
    TestBed.configureTestingModule({
      providers: [LoginService],
      imports: [HttpClientModule, HttpClientInMemoryWebApiModule.forRoot(DataService)],
    });

    const loginService = TestBed.inject(LoginService);
    const res = await firstValueFrom(loginService.login('testuser', 'testpassword'));

    expect(res).deep.eq({
      status: 200,
      message: 'testuser'
    });
  });

  it('should error with bad credentials', async () => {
    TestBed.configureTestingModule({
      providers: [LoginService],
      imports: [HttpClientModule, HttpClientInMemoryWebApiModule.forRoot(DataService)],
    });

    const loginService = TestBed.inject(LoginService);
    const res = await firstValueFrom(loginService.login('baduser', 'badpassword'));

    expect(res).deep.eq({
      status: 404,
      message: 'error during the auth, status code: 404'
    });
  });
});
