import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';
import { ExcelService } from '../_services/excel.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { FormControl } from '@angular/forms';

declare var $: any;

@Component({ templateUrl: 'myTrainings.component.html' })
export class MyTrainingsComponent implements OnInit {



    trainings$ = new BehaviorSubject([]);
    trainings: Training[] = [];

    superlatives$ = new BehaviorSubject<{ [superlativeName: string]: string }>({});
    tableDataSource$ = new BehaviorSubject<any[]>([]);
    displayedColumns$ = new BehaviorSubject<string[]>([

        'idUserHasTraining',
        'name',
        'provider',
        'cluster',
        'price',
        'status',
        'ProcurementStatus',
        'UserStatus',
        'AdditionalNoteUser',
        'AdditionalNoteProcurement',
        'DecisionByProcurementDate',
        'SignUpDate',
        'participateUser',
        'cancelUser',
        'noteUser'
    ]);
    currentPage$ = new BehaviorSubject<number>(1);
    pageSize$ = new BehaviorSubject<number>(1000);
    dataOnPage$ = new BehaviorSubject<any[]>([]);
    searchFormControl = new FormControl();
    sortKey$ = new BehaviorSubject<string>('name');
    sortDirection$ = new BehaviorSubject<string>('asc');




    private training: Training;
    private selected: Training;
    currentUser: User;
    private saved: boolean;


    constructor(private excelService: ExcelService, private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

    ngOnInit() {

        // loads data into behavorial subject
        this.getMyTrainings();


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

    getMyTrainings() {
        this.trainigService.getMyTrainings(this.currentUser.extensionAttribute1).pipe(first()).subscribe(tr => {
            this.trainings$.next(tr);
        });
    }

    participateUser(training: Training) {
        this.trainigService.participateUser(this.currentUser, training.idUserHasTraining).subscribe(ok => {
            this.getMyTrainings();
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
        });;
    }

    cancelUser(training: Training) {
        this.trainigService.cancelUser(this.currentUser, training.idUserHasTraining).subscribe(ok => {
            this.getMyTrainings();
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
        });;
    }

    // export to excel  // https://stackblitz.com/edit/angular6-export-xlsx?file=src%2Fapp%2Fapp.module.ts
    exportAsXLSX(): void {

        this.trainings$.subscribe(changedTrainingData => {
            this.trainings = changedTrainingData;
            this.excelService.exportAsExcelFile(this.trainings, 'My trainings');
        });

    }

    //////////////////////////// note start ////////////////////////////////
    private action = 'add';
    private editedTraining = new Training();
    private status = 'ok';

    editNoteClicked(training: Training) {
        this.action = 'edit';
        this.editedTraining = JSON.parse(JSON.stringify(training));
        $('#noteModal').modal('show');
    }

    editedNoteSaved(training: Training) {
        if (this.action == 'add') {
            this.trainigService.saveUserNote(training).subscribe(ok => {
                this.getMyTrainings();
            },
                errorMsg => {
                    this.status = 'error';
                    console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
                });
        } else {
            this.trainigService.saveUserNote(training).subscribe(ok => {
                this.getMyTrainings();
            },
                errorMsg => {
                    this.status = 'error';
                    console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
                });
        }
    }

    //////////////////////////// note end ////////////////////////////////

}