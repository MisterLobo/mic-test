import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { interval, Observable, Subscription }  from 'rxjs';
declare const MediaRecorder: any;

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss'],
})
export class AudioRecorderComponent implements OnInit {
  recordings = [];
  requestStatus: 'granted' | 'pending' | 'denied' = 'pending';
  recorderState: 'inactive' | 'recording' | 'paused' = 'inactive';
  recordedChunks = [];
  recordTime = 0;
  @ViewChild('player', {static: false}) player;
  @ViewChild('timeLimit', {static: false}) timeLimit;
  _mediaRecorder: any;
  recordLimit: 30;
  startTime: Date;
  endTime: Date;
  timer: Observable<number>;
  runtime: number;
  timerSub: Subscription;

  constructor() {
    navigator.permissions.query({name:'microphone'}).then((result) => {
      if (result.state == 'granted') {
        this.requestStatus = 'granted';
        this.requestPermission();
      } else if (result.state == 'prompt') {
        this.requestStatus = 'pending';
      } else if (result.state == 'denied') {
        this.requestStatus = 'denied';
      }
      result.onchange = function() {
    
      };
    });
  }

  ngOnInit() {
    this.runtime = 0;
  }

  handleSuccess(stream) {
    this._mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    this._mediaRecorder.onstart = () => { this.startHandler() };
    this._mediaRecorder.onstop = () => { this.stopHandler() };
    this._mediaRecorder.onpause = () => { this.pauseHandler() };
    this._mediaRecorder.onresume = () => { this.resumeHandler() };
    this._mediaRecorder.onwarning = (w) => { this.warningHandler(w) };
    this._mediaRecorder.onerror = (e) => { this.errorHandler(e) };
    this._mediaRecorder.ondataavailable = (d) => { this.dataHandler(d) };
    console.log('success');
    if (window.URL) {
      this.player.srcObject = stream;
    } else {
      this.player.src = stream;
    }
    this.requestStatus = 'granted';
    console.log(this.player);
  };

  requestPermission() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => { this.handleSuccess(stream) });
  }

  dataHandler(e) {
    console.log('data available');
    if (e.data.size > 0) {
      console.log('data captured');
      this.recordedChunks.push(e.data);
      const src = URL.createObjectURL(new Blob(this.recordedChunks, {type : 'audio/wav'}));
      console.log(src);
      const audio = new Audio(src);
      audio.play();
      this.player.nativeElement.src = src;
    }
  }

  startRecording() {
    this._mediaRecorder.start();
  }
  startHandler() {
    console.log('started');
    this.recorderState = 'recording';
    this.timer = interval(1000);
    this.timerSub = this.timer.subscribe(x => {
      this.runtime = x;
    });
  }

  stopRecording() {
    this._mediaRecorder.stop();
  }
  stopHandler() {
    console.log('stopped');
    this.timerSub.unsubscribe();
    this.recorderState = 'inactive';
  }

  pauseRecording() {
    this._mediaRecorder.pause();
  }
  pauseHandler() {
    console.log('paused');
    this.recorderState = 'paused';
  }

  resumeRecording() {
    this._mediaRecorder.resume();
  }
  resumeHandler() {
    console.log('resumed');
    this.recorderState = 'recording';
  }

  saveRecording() {
    
  }
  deleteRecording() {
    this.recordedChunks = [];
    this.player.nativeElement.src = null;
  }

  warningHandler(w) {
    console.warn(w);
  }
  errorHandler(e) {
    console.error(e);
  }

}
