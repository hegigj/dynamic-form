import {NgModule} from '@angular/core';
import {ReversePipe} from './controls/reverse.pipe';
import {CharacterPipe} from './controls/character.pipe';
import {DateSegmentationPipe} from './controls/date-segmentation.pipe';
import {SearchPipe} from './controls/search.pipe';

@NgModule({
  declarations: [ReversePipe, CharacterPipe, DateSegmentationPipe, SearchPipe],
  exports: [ReversePipe, CharacterPipe, DateSegmentationPipe, SearchPipe]
})
export class PipeModule {}
