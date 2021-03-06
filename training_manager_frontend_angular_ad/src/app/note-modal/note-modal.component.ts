import { Component, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';
declare var $:any;

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.component.html'
})
export class NoteModalComponent implements OnChanges {

  //private workshops:BicycleCategory[] = [];
  
  @Input() private training:Training;
  @Input() private actionWithTraining:string;
  @Output() savedTraining = new EventEmitter<Training>();
  constructor(private restService: TrainingService) { }

  ngOnChanges() {

  }

  get actualUser(): string {
    return JSON.stringify(this.training);
  }

  get title():string {
    if (this.actionWithTraining == 'add') {
      return 'Add new Provider';
    } else {
      return 'Edit note';
    }
  }


  onSubmit() {
    this.savedTraining.emit(this.training);
    $('#noteModal').modal('hide');
  }
  
   
}
