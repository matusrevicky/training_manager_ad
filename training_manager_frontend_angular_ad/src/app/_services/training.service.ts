import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Training } from '@/_models/training';
import { User } from '@/_models/user';
import { Cluster } from '@/_models/cluster';
import { Provider } from '@/_models/provider';
import { wholeTraining } from '@/_models/wholeTraining';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  constructor(private http: HttpClient) { }


  getAllTrainings(id: number) {
    return this.http.get<Training[]>(`${config.apiUrl}/trainings/all/${id}`);
  }

  bindUserWithTraining( id: number, user: User): Observable<boolean> {
    return this.http.post(`${config.apiUrl}/trainings/bindwithuser/${id}`, user).pipe(map(_ => true));
  }

  acceptUserTraining(user: User, id: number, status: number): Observable<boolean> {
    return this.http.post(`${config.apiUrl}/trainings/acceptUserTraining/${id}/${status}`, user).pipe(map(_ => true));
  }

  denyUserTraining(user: User, id: number, status: number): Observable<boolean> {
    return this.http.post(`${config.apiUrl}/trainings/denyUserTraining/${id}/${status}`, user).pipe(map(_ => true));
  }


  getMyTrainings(id: number) {
    return this.http.get<Training[]>(`${config.apiUrl}/trainings/${id}`);
  }

  getEmployeeTrainings(id: string) {
    return this.http.get<Training[]>(`${config.apiUrl}/trainings/employeeTrainings/${id}`);
  }

  ///////////////// saves ////////////
  saveTraining(training: Training): Observable<boolean> {
    return this.http.post(`${config.apiUrl}/trainings`, training).pipe(map(_ => true));
  }
  saveProvider(training: Training): Observable<boolean> {
    return this.http.post(`${config.apiUrl}/trainings/provider`, training).pipe(map(_ => true));
  }
  saveCluster(training: Training): Observable<boolean> {
    return this.http.post(`${config.apiUrl}/trainings/cluster`, training).pipe(map(_ => true));
  }

  /////////////////// gets /////////////////
  getClusters() {
    return this.http.get<Cluster[]>(`${config.apiUrl}/trainings/cluster/clusters`);
  }
  getProviders() {
    return this.http.get<Provider[]>(`${config.apiUrl}/trainings/provider/providers`);
  }
  getTrainings() {
    return this.http.get<Training[]>(`${config.apiUrl}/trainings/training/trainings`);
  }

  saveWholeTraining(training: wholeTraining): Observable<boolean> {
    return this.http.post(`${config.apiUrl}/trainings/wholeTraining`, training).pipe(map(_ => true));
  }

}