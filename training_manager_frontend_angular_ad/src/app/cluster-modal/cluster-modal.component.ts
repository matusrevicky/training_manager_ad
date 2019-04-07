import { Component, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';
import { Cluster } from '@/_models/cluster';
declare var $:any;

@Component({
  selector: 'app-cluster-modal',
  templateUrl: './cluster-modal.component.html'
})
export class ClusterModalComponent implements OnChanges {

  private workshops:Cluster[] = [];
  
  @Input() private training:Training;
  @Input() private actionWithTraining:string;
  @Output() savedTraining = new EventEmitter<Training>();
  constructor(private restService: TrainingService) { }

  ngOnChanges() {
    this.getWorkshops();
  }

  get actualUser(): string {
    return JSON.stringify(this.training);
  }
  get title():string {
    if (this.actionWithTraining == 'add') {
      return 'Add new Agent';
    } else {
      return 'Edit Agent';
    }
  }

  getWorkshops() {
    this.restService.getClusters().subscribe(w => {
      
      this.workshops = w;
    //  this.user.category = this.workshops[this.user.category.id-1];
    });
  }

  onSubmit() {
    this.savedTraining.emit(this.training);
    $('#trainingModal').modal('hide');
  }
  
   
}
