import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { AuthGuard } from './_guards';
import { Role } from './_models';
import { TrainingsComponent } from './trainings';
import { MyTrainingsComponent } from './myTrainings';
import { MyEmployeesTrainingsComponent } from './myEmployeesTrainings';
import { SubstituteComponent } from './substitute';
import { TableComponent } from './table/table.component';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
       // data: { roles: [Role.Admin] }
    },
    {
        path: 'trainings',
        component: TrainingsComponent,
        canActivate: [AuthGuard],
       
    },
    {
        path: 'myTrainings',
        component: MyTrainingsComponent,
        canActivate: [AuthGuard],
       
    },
    {
        path: 'employeeTrainings',
        component: MyEmployeesTrainingsComponent,
        canActivate: [AuthGuard],
       
    },
    {
        path: 'substitute',
        component: SubstituteComponent,
        canActivate: [AuthGuard],
       
    },
    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'table',
        component: TableComponent
    },


    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);