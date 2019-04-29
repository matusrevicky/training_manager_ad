import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';

@Component({  selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

     get isProcurement() {
         return this.currentUser && this.currentUser.procurement === 1;
     }

     get isRoleUser() {
        return this.currentUser && this.currentUser.role === 0;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}