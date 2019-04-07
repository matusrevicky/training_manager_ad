import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

@Component({ templateUrl: 'substitute.component.html' })
export class SubstituteComponent implements OnInit {
    users: User[] = [];
    myEmployeeTrainings: Training[] = [];
    currentUser: User;
    private saved: boolean;
    
    constructor(private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) 
    { this.currentUser = this.authenticationService.currentUserValue; }

    ngOnInit() {
        this.getSubstitute();
        
    }

    getSubstitute(){
        this.userService.getSubstitute(this.currentUser.idUser).pipe(first()).subscribe(tr => {
            this.users = tr;
        });
    }

     getSubstituesEmployees(user: User){
        this.trainigService.getEmployeeTrainings(user.idUser).pipe(first()).subscribe(tr => {
            this.myEmployeeTrainings = tr;
        });
     }

     onApprove(training:Training) {
        this.trainigService.acceptUserTraining(training, this.currentUser.idUser,this.currentUser.role ).subscribe(ok => {
            this.saved = true;
            setTimeout(_=> this.saved = false, 5000);
         });;
         
         
    }

    onDeny(training:Training) {
        this.trainigService.denyUserTraining(training, this.currentUser.idUser,this.currentUser.role ).subscribe(ok => {
            this.saved = true;
            setTimeout(_=> this.saved = false, 5000);
         });;
         
      

    }

}