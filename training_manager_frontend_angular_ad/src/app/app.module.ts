import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend


import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { TrainingsComponent } from './trainings';
import { ManageTrainingsComponent } from './manageTrainings';

import { TrainingModalComponent } from './training-modal';
import { ProviderModalComponent } from './provider-modal';
import { ClusterModalComponent } from './cluster-modal';
import { NoteModalComponent } from './note-modal';
import { NotePModalComponent } from './noteP-modal';

import { MyTrainingsComponent } from './myTrainings';
import { MyEmployeesTrainingsComponent } from './myEmployeesTrainings';
import { SubstituteComponent } from './substitute';
import { Procurement } from './procurement';

import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ExcelService } from './_services/excel.service';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,

        CdkTableModule,
        NgbModule.forRoot(),
        FormsModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        AdminComponent,
        LoginComponent,
        TrainingsComponent,
        ManageTrainingsComponent,
        TrainingModalComponent,
        ProviderModalComponent,
        ClusterModalComponent,
        NoteModalComponent,
        MyTrainingsComponent,
        MyEmployeesTrainingsComponent,
        SubstituteComponent,
        Procurement,
        NotePModalComponent


    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        // fakeBackendProvider
        ExcelService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }