import React, { Component } from "react";

const FETCH_MUSIC_API = 'http://127.0.0.1:5000';

class Music extends Component {
  state = {
    url: null,
    progress: 0,
    duration: null,
    loading: false
  }

  playMIDI = () => {
    window.MIDIjs.play(this.state.url);
  }

  stopMIDI = () => {
    window.MIDIjs.stop();
    this.setState({ progress: 0 });
  }

  pauseMIDI = () => {
    window.MIDIjs.pause();
  }

  componentDidMount() {
    window.MIDIjs.get_duration(this.state.url, duration => {
      this.setState({ duration: duration })
    })
  }

  fetchMusic = () => {
    this.setState({ loading: true });
    fetch(FETCH_MUSIC_API)
      .then(response => response.text())
      .then(url => this.setState({ url: url, loading: false }, () => {
        window.MIDIjs.get_duration(this.state.url, duration => {
          this.setState({ duration: duration })
        })
      }))
      .catch(error => {
        this.setState({ loading: false });
      })
  }

  render() {
    window.MIDIjs.player_callback = (event) => {
      this.setState({ progress: Math.round(event.time * 100 / this.state.duration) });
    }

    return (
      <div>
        <h4>Play some random music</h4>
        <button onClick={this.fetchMusic} className="btn btn-success m-1">Get Music</button>
        <br />
        {this.state.loading
          ?
          <div>
            <div className="spinner-grow" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p>Loading music...</p>
          </div>
          : this.state.url
            ?
            <div className="container w-50">
              <div className="progress my-2">
                <div
                  className="progress-bar progress-bar-striped"
                  role="progressbar"
                  style={{ width: this.state.progress }}
                  aria-valuemin="0" aria-valuemax="100" />
              </div>
              <button onClick={this.playMIDI} className="btn btn-primary mx-1">Play</button>
              <button onClick={this.stopMIDI} className="btn btn-warning mx-1">Pause</button>
              <button onClick={this.stopMIDI} className="btn btn-danger mx-1">Stop</button>
              <a className="btn btn-info" href={this.state.url}>Download</a>
            </div>
            : null
        }
      </div >
    );
  }
}

export default Music;
