import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { FormControl } from '@angular/forms';

import { ExcelService } from '../_services/excel.service';

declare var $: any;

@Component({ templateUrl: 'myEmployeesTrainings.component.html' })
export class MyEmployeesTrainingsComponent implements OnInit {

    error = '';

    trainings$ = new BehaviorSubject([]);

    superlatives$ = new BehaviorSubject<{ [superlativeName: string]: string }>({});
    tableDataSource$ = new BehaviorSubject<any[]>([]);
    displayedColumns$ = new BehaviorSubject<string[]>([
        'idUserHasTraining',
        'idUser',
        'nameUser',
        'trainingname',
        'price',
        'providername',
        'clustername',
        'trainingStatus',
        'ProcurementStatus',
        'UserStatus',
        'AdditionalNoteUser',
        'AdditionalNoteProcurement',
        'DecisionByProcurementDate',
        'SignUpDate',
        'onApprove',
        'onDeny'

    ]);
    currentPage$ = new BehaviorSubject<number>(1);
    pageSize$ = new BehaviorSubject<number>(1000);
    dataOnPage$ = new BehaviorSubject<any[]>([]);
    searchFormControl = new FormControl();
    sortKey$ = new BehaviorSubject<string>('idUserHasTraining');
    sortDirection$ = new BehaviorSubject<string>('asc');


      trainings: Training[] = [];

    private training: Training;
    private selected: Training;
    currentUser: User;
    private saved: boolean;


    constructor(private excelService: ExcelService, private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

    ngOnInit() {

        // loads data into behavorial subject
        this.getEmployeeTrainings();


        // console.log(this.tra$);
        this.trainings$.subscribe(changedHeroData => {
            const superlatives = {
             
            };

            Object.values(changedHeroData).forEach(hero => {
                Object.keys(hero).forEach(key => {
                    if (key === 'idUserHasTraining' || key === 'types') { return; }

                    const highest = `highest-${key}`;
                    if (!superlatives[highest] || hero[key] > changedHeroData[superlatives[highest]][key]) {
                        superlatives[highest] = hero.idUserHasTraining;
                    }

                    const lowest = `lowest-${key}`;
                    if (!superlatives[lowest] || hero[key] < changedHeroData[superlatives[lowest]][key]) {
                        superlatives[lowest] = hero.idUserHasTraining;
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

    getEmployeeTrainings() {
        this.trainigService.getEmployeeTrainings(this.currentUser.distinguishedName).pipe(first()).subscribe(tr => {
            this.trainings$.next(tr);
        });
    }

    onApprove(training: Training) {
        this.trainigService.acceptUserTraining(this.currentUser, training.idUserHasTraining, training.trainingStatus  ).subscribe(ok => {
            this.getEmployeeTrainings();
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
            this.error = '';
           
        },  error => {
            this.error = error;
        });;
    }

    onDeny(training: Training) {
        this.trainigService.denyUserTraining(this.currentUser, training.idUserHasTraining, training.trainingStatus  ).subscribe(ok => {
            this.getEmployeeTrainings();
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
            this.error = '';
        },  error => {
            this.error = error;
        });;
    }

    onChangePageSize(value) {
        this.pageSize$.next(value);
      }

      // export to excel  // https://stackblitz.com/edit/angular6-export-xlsx?file=src%2Fapp%2Fapp.module.ts
    exportAsXLSX(): void {

        this.trainings$.subscribe(changedTrainingData => {
            this.trainings = changedTrainingData;
            this.excelService.exportAsExcelFile(this.trainings, 'My trainings');
        });

    }

}




















