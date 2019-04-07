import { Component, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';
declare var $:any;

@Component({
  selector: 'app-training-modal',
  templateUrl: './training-modal.component.html'
})
export class TrainingModalComponent implements OnChanges {

  //private workshops:BicycleCategory[] = [];
  
  @Input() private training:Training;
  @Input() private actionWithTraining:string;
  @Output() savedTraining = new EventEmitter<Training>();
  constructor(private restService: TrainingService) { }

  ngOnChanges() {
  //  this.getWorkshops();
  }

  get actualUser(): string {
    return JSON.stringify(this.training);
  }
  get title():string {
    if (this.actionWithTraining == 'add') {
      return 'Add new Training';
    } else {
      return 'Edit Agent';
    }
  }

 /* getWorkshops() {
    this.restService.getBicycleCategory().subscribe(w => {
      
      this.workshops = w;
      this.user.category = this.workshops[this.user.category.id-1];
    });
  }*/

  onSubmit() {
    this.savedTraining.emit(this.training);
    $('#trainingModal').modal('hide');
  }
  
   
}
