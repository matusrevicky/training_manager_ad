import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { Cluster } from '@/_models/cluster';
import { FormControl } from '@angular/forms';
import { MyTrainingsComponent } from '@/myTrainings';
import { Observable } from 'rxjs';
import { Provider } from '@/_models/provider';
import { wholeTraining } from '@/_models/wholeTraining';

declare var $: any;

@Component({ templateUrl: 'manageTrainings.component.html', styleUrls: ['./manageTrainings.component.css'] })
export class ManageTrainingsComponent implements OnInit {



  trainings$ = new BehaviorSubject([]);

  superlatives$ = new BehaviorSubject<{ [superlativeName: string]: string }>({});
  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    'Active',
    'name',
    'clustername',
    'providername',
    'price',
    'CreationTime',
    'disableWholeTraining',
    'enableWholeTraining'
    

  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10000);
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('CreationTime');
  sortDirection$ = new BehaviorSubject<string>('desc');


  //  trainings: Training[] = [];
  private wholeTraining = new wholeTraining;

  private training: Training;
  private selected: Training;
  currentUser: User;
  private saved: boolean;


  constructor(private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit() {


    this.getClusters();
    this.getProviders();
    this.getTrainings();



    // loads data into behavorial subject
    this.getAllTrainings();


    // console.log(this.tra$);
    this.trainings$.subscribe(changedHeroData => {
      const superlatives = {

      };

      Object.values(changedHeroData).forEach(hero => {
        Object.keys(hero).forEach(key => {
          if (key === 'CreationTime' || key === 'types') { return; }

          const highest = `highest-${key}`;
          if (!superlatives[highest] || hero[key] > changedHeroData[superlatives[highest]][key]) {
            superlatives[highest] = hero.CreationTime;
          }

          const lowest = `lowest-${key}`;
          if (!superlatives[lowest] || hero[key] < changedHeroData[superlatives[lowest]][key]) {
            superlatives[lowest] = hero.CreationTime;
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

  // enables the user to choose number of items per page
  onChangePageSize(value) {
    this.pageSize$.next(value);
  }

  // subscribes
  getAllTrainings() {
    this.trainigService.getAllTrainings(this.currentUser.extensionAttribute1).pipe(first()).subscribe(tr => {
      this.trainings$.next(tr);
    });
  }

  //////////////////////// whole training submit start//////////////////////////////////
  onWholeTrainigSubmit() {
   
    this.trainigService.saveWholeTraining(this.wholeTraining).subscribe(ok => {
      this.getAllTrainings();
      this.saved = true;
      setTimeout(_ => this.saved = false, 5000);
      this.error = '';
    },
    error => {
        this.error = error;
        this.loading = false;
    });;
  }

  //////////////////////// whole training submit end//////////////////////////////////


  //////////////////////////// trainings start ////////////////////////////////
  private action = 'add';
  private editedTraining = new Training();
  private status = 'ok';

  editedTrainingSaved(training: Training) {
    if (this.action == 'add') {
      this.trainigService.saveTraining(training).subscribe(ok => {
        this.getTrainings();
      },
        errorMsg => {
          this.status = 'error';
          console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
        });
    } else {
      this.trainigService.saveTraining(training).subscribe(ok => {
        this.getTrainings();
      },
        errorMsg => {
          this.status = 'error';
          console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
        });
    }
  }

  addTrainingButtonClicked() {
    this.action = 'add';
    this.editedTraining = new Training();
  }

  editTrainingClicked(training: Training) {
    this.action = 'edit';
    this.editedTraining = JSON.parse(JSON.stringify(training));
    $('#trainingModal').modal('show');
  }

  private trainings: Training[] = [];

  getTrainings() {
    let pipe: Observable<Training[]> = this.trainigService.getTrainings();
    pipe.subscribe(usersFromPipe => {
      this.trainings = usersFromPipe
    });
  }

  //////////////////////////// trainings end ////////////////////////////////


  //////////////////////////// providers start ////////////////////////////////
  addProviderButtonClicked() {
    this.action = 'add';
    this.editedTraining = new Training();
  }

  editedProviderSaved(training: Training) {
    if (this.action == 'add') {
      this.trainigService.saveProvider(training).subscribe(ok => {
        this.getProviders();
      },
        errorMsg => {
          this.status = 'error';
          console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
        });
    } else {
      this.trainigService.saveProvider(training).subscribe(ok => {
        this.getProviders();
      },
        errorMsg => {
          this.status = 'error';
          console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
        });
    }
  }

  private providers: Provider[] = [];

  getProviders() {
    let pipe: Observable<Provider[]> = this.trainigService.getProviders();
    pipe.subscribe(usersFromPipe => {
      this.providers = usersFromPipe
    });
  }

  //////////////////////////// providers end ////////////////////////////////

  //////////////////////////// clusters start ////////////////////////////////
  addClusterButtonClicked() {
    this.action = 'add';
    this.editedTraining = new Training();
  }

  editedClusterSaved(training: Training) {
    if (this.action == 'add') {
      this.trainigService.saveCluster(training).subscribe(ok => {
        this.getClusters();
      },
        errorMsg => {
          this.status = 'error';
          console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
        });
    } else {
      this.trainigService.saveCluster(training).subscribe(ok => {
        this.getClusters();
      },
        errorMsg => {
          this.status = 'error';
          console.log("chyba komunikacie: " + JSON.stringify(errorMsg));
        });
    }
  }

  private clusters: Cluster[] = [];

  getClusters() {
    let pipe: Observable<Cluster[]> = this.trainigService.getClusters();
    pipe.subscribe(usersFromPipe => {
      this.clusters = usersFromPipe
    });
  }

  disableWholeTraining(wholeTraining: Training){
    this.trainigService.disableWholeTraining(this.currentUser, wholeTraining.idWholeTraining).subscribe(ok => {
      this.getAllTrainings();
      this.saved = true;
      setTimeout(_ => this.saved = false, 5000);
    });;
  }

  enableWholeTraining(wholeTraining: Training){
    this.trainigService.enableWholeTraining(this.currentUser, wholeTraining.idWholeTraining).subscribe(ok => {
      this.getAllTrainings();
      this.saved = true;
      setTimeout(_ => this.saved = false, 5000);
    });;
  }
  //////////////////////////// clusters end ////////////////////////////////


  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

}