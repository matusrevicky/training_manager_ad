
export class Training {
    idUserHasTraining: number;
    idWholeTraining: number;
    idTraining: number;
    idCluster: number;
    idProvider: number;
    name: string;
    clustername: string;
    providername: string;
    price: number;
    trainingStatus: number;
    active:number;
    AdditionalNoteUser: string;
    AdditionalNoteProcurement: string;

    constructor() {
        this.name = "";
    }
}