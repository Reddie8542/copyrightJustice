import { Component, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-audio-config-form',
  templateUrl: 'audio-config-form.component.html',
  styleUrls: ['audio-config-form.component.scss']
})
export class AudioConfigFormComponent {
  @Input() form: FormGroup;

  getAudioConfigs(): FormArray {
    return this.form.get('audioConfigs') as FormArray;
  }

  getAudioControl(controlName: string, index: number): FormControl {
    return this.getAudioConfigs().at(index).get(controlName) as FormControl;
  }
}
