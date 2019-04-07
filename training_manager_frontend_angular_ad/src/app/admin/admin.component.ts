import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

@Component({ templateUrl: 'admin.component.html' })
export class AdminComponent implements OnInit {
    users: User[] = [];
   // trainings: Training[] = [];

    constructor(private userService: UserService, private trainigService: TrainingService) { }

    ngOnInit() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
      //  this.trainigService.getAllTrainings().pipe(first()).subscribe(trainings => {
      //      this.trainings = trainings;
       // });
    }
}