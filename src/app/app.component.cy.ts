import { HttpClientModule } from "@angular/common/http"
import { FormsModule } from "@angular/forms"
import { MountConfig } from "cypress/angular"
import { AppComponent } from "./app.component"
import { ButtonComponent } from "./button/button.component"
import { LoginFormComponent } from "./login-form/login-form.component"
import { LoginService } from "./login.service"
import { WelcomeComponent } from "./welcome/welcome.component"
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api"
import { DataService } from "./data.service"

describe('AppComponent', () => {
    const config: MountConfig<AppComponent> = {
        imports: [FormsModule, HttpClientModule, HttpClientInMemoryWebApiModule.forRoot(DataService)], providers: [LoginService], declarations: [LoginFormComponent, ButtonComponent, WelcomeComponent]
    }
    it('should redirect to welcome screen when creds are correct', () => {
        cy.mount(AppComponent, config)
        cy.contains('Username').find('input').type('testuser')
        cy.contains('Password').find('input').type('testpassword')
        cy.get('button').contains('Login').click()
        cy.contains('Welcome testuser')
        cy.get('button').contains('Log Out').click()
      })

    it('should show error message when creds are incorrect', () => {
        cy.mount(AppComponent, config)
        cy.contains('Username').find('input').type('baduser')
        cy.contains('Password').find('input').type('badpassword')
        cy.get('button').contains('Login').click()
        cy.contains('error during the auth, status code: 404')
    })
})
