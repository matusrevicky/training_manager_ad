import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MyTrainingsComponent } from '@/myTrainings';
import {ExcelService} from '../_services/excel.service';
declare var $:any;

@Component({ templateUrl: 'trainings.component.html' })
export class TrainingsComponent implements OnInit {

  
  
    trainings$ = new BehaviorSubject([]);

    superlatives$ = new BehaviorSubject<{ [superlativeName: string]: string }>({});
    tableDataSource$ = new BehaviorSubject<any[]>([]);
    displayedColumns$ = new BehaviorSubject<string[]>([ 
        'idWholeTraining',
        'name',
        'clustername',
        'providername',
        'price',
        'CreationTime',
        'isMy',
        'onSubmit',
    ]);
    currentPage$ = new BehaviorSubject<number>(1);
    pageSize$ = new BehaviorSubject<number>(1000);
    dataOnPage$ = new BehaviorSubject<any[]>([]);
    searchFormControl = new FormControl();
    sortKey$ = new BehaviorSubject<string>('name');
    sortDirection$ = new BehaviorSubject<string>('asc');


   trainings: Training[] = [];

    private training: Training;
    private selected: Training;
    currentUser: User;
    private saved: boolean;
    

    constructor(private excelService:ExcelService, private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

    ngOnInit() {

        // loads data into behavorial subject
      this.getAllTrainings();


        // console.log(this.tra$);
        this.trainings$.subscribe(changedHeroData => {
            const superlatives = {
                
            };

            Object.values(changedHeroData).forEach(hero => {
                Object.keys(hero).forEach(key => {
                    if (key === 'name' || key === 'types') { return; }

                    const highest = `highest-${key}`;
                    if (!superlatives[highest] || hero[key] > changedHeroData[superlatives[highest]][key]) {
                        superlatives[highest] = hero.name;
                    }

                    const lowest = `lowest-${key}`;
                    if (!superlatives[lowest] || hero[key] < changedHeroData[superlatives[lowest]][key]) {
                        superlatives[lowest] = hero.name;
                    }
                });
            });

            this.superlatives$.next(superlatives);
        });

        combineLatest(this.tableDataSource$, this.currentPage$, this.pageSize$)
            .subscribe(([allSources, currentPage, pageSize]) => {
                const startingIndex = (currentPage - 1) * pageSize;
                const onPage = allSources.slice(startingIndex, startingIndex + pageSize);
                this.dataOnPage$.next(onPage);
            });

        this.trainings$.pipe(take(1)).subscribe(heroData => {
            this.tableDataSource$.next(Object.values(heroData));
        });

        combineLatest(this.trainings$, this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$)
            .subscribe(([changedHeroData, searchTerm, sortKey, sortDirection]) => {
                const heroesArray = Object.values(changedHeroData);
                let filteredHeroes: any[];

                if (!searchTerm) {
                    filteredHeroes = heroesArray;
                } else {
                    const filteredResults = heroesArray.filter(hero => {
                        return Object.values(hero)
                            .reduce((prev, curr) => {
                                return prev || curr.toString().toLowerCase().includes(searchTerm.toLowerCase());
                            }, false);
                    });
                    filteredHeroes = filteredResults;
                }

                const sortedHeroes = filteredHeroes.sort((a, b) => {
                    if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
                    if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
                    return 0;
                });

                this.tableDataSource$.next(sortedHeroes);
            });

        this.searchFormControl.setValue('');
    }

    adjustSort(key: string) {
        if (this.sortKey$.value === key) {
            if (this.sortDirection$.value === 'asc') {
                this.sortDirection$.next('desc');
            } else {
                this.sortDirection$.next('asc');
            }
            return;
        }

        this.sortKey$.next(key);
        this.sortDirection$.next('asc');
    }

    onChangePageSize(value) {
      this.pageSize$.next(value);
    }

    getAllTrainings() {

        this.trainigService.getActiveTrainings(this.currentUser.extensionAttribute1).pipe(first()).subscribe(tr => {
            this.trainings$.next(tr);
        });


      //  this.trainigService.getAllTrainings(this.currentUser.idUser).pipe(first()).subscribe(trainings => {
       //     this.trainings = trainings;
       // });
    }

    onSubmit(training: Training) {
        this.trainigService.bindUserWithTraining(training.idWholeTraining, this.currentUser).subscribe(ok => {
            this.getAllTrainings();
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
        });;
    }


    

    // export to excel  // https://stackblitz.com/edit/angular6-export-xlsx?file=src%2Fapp%2Fapp.module.ts
    exportAsXLSX():void {
        
        this.trainings$.subscribe(changedTrainingData => {
           this.trainings = changedTrainingData;
           this.excelService.exportAsExcelFile(this.trainings, 'trainings');
            });
       
      }

   
}