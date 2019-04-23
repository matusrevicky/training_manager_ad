import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { FormControl } from '@angular/forms';

declare var $: any;

@Component({ templateUrl: 'procurement.component.html' })
export class Procurement implements OnInit {

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
        'noteUser',
        'acceptedProcurement',
        'orderedProcurement',
        'cancelledProcurement'

    ]);
    currentPage$ = new BehaviorSubject<number>(1);
    pageSize$ = new BehaviorSubject<number>(1000);
    dataOnPage$ = new BehaviorSubject<any[]>([]);
    searchFormControl = new FormControl();
    sortKey$ = new BehaviorSubject<string>('idUserHasTraining');
    sortDirection$ = new BehaviorSubject<string>('asc');


    //  trainings: Training[] = [];

    private training: Training;
    private selected: Training;
    currentUser: User;
    private saved: boolean;


    constructor(private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

    ngOnInit() {

        // loads data into behavorial subject
        this.getgetEveryonesTrainings();


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

    getgetEveryonesTrainings() {
        this.trainigService.getEveryonesTrainings(this.currentUser.extensionAttribute1).pipe(first()).subscribe(tr => {
            this.trainings$.next(tr);
        });
    }

    onChangePageSize(value) {
        this.pageSize$.next(value);
    }


    acceptedProcurement(training: Training) {
        this.trainigService.acceptedProcurement(this.currentUser, training.idUserHasTraining).subscribe(ok => {
            this.getgetEveryonesTrainings();
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
        });;
    }

    orderedProcurement(training: Training) {
        this.trainigService.orderedProcurement(this.currentUser, training.idUserHasTraining).subscribe(ok => {
            this.getgetEveryonesTrainings();
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
        });;
    }

    cancelledProcurement(training: Training) {
        this.trainigService.cancelledProcurement(this.currentUser, training.idUserHasTraining).subscribe(ok => {
            this.getgetEveryonesTrainings();
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
        });;
    }
    


    //////////////////////////// note start ////////////////////////////////
    private action = 'add';
    private editedTraining = new Training();
    private status = 'ok';

    editNoteClicked(training: Training) {
        this.action = 'edit';
        this.editedTraining = JSON.parse(JSON.stringify(training));
        $('#notePModal').modal('show');
    }

    editedNoteSaved(training: Training) {
        if (this.action == 'add') {
            this.trainigService.saveProcurementNote(training).subscribe(ok => {
                this.getgetEveryonesTrainings();
            },
                errorMsg => {
                    this.status = 'error';
                    console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
                });
        } else {
            this.trainigService.saveProcurementNote(training).subscribe(ok => {
                this.getgetEveryonesTrainings();
            },
                errorMsg => {
                    this.status = 'error';
                    console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
                });
        }
    }



    //////////////////////////// note end ////////////////////////////////

}




















