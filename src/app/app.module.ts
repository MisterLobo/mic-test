import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import {
  MatCardModule,
  MatButtonModule,
  MatCommonModule,
  MatIconModule,
  MatListModule,
  MatSliderModule,
  MatProgressBarModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { AudioRecorderComponent } from './audio-recorder/audio-recorder.component';

@NgModule({
  declarations: [
    AppComponent,
    AudioRecorderComponent
  ],
  imports: [
    BrowserModule,
    MatCommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSliderModule,
    MatProgressBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AudioRecorderComponent
  ]
})
export class AppModule {
  constructor(private injector: Injector) {
    const customElement = createCustomElement(AudioRecorderComponent, { injector });
    customElements.define('audio-recorder', customElement);
  }

  ngDoBootstrap() { }
}
