import React from 'react';
import ReactDOM from 'react-dom';

import BallotPreview from './BallotPreview';
import BallotEdit from './BallotEdit';

import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

import './index.css';
import './fonts/Poppins-Regular.ttf'
import './fonts/Overpass-ExtraLight.ttf'

class App extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      ballotHeight: 0,
      visibleMenu: true,
      ballotState: {
        place: "Anytown, USA",
        date: "April 35, 2020",
        electionName: "Council Election",
        includeInstructions: true,
        contests: [
          {
            position: "President",
            n_to_elect: "One",
            candidates: [
              {name: "Olivia Offerman", party: "Orange Party"},
              {name: "Priyanka Palo", party: "Pink Party"},
              {name: "George Garcia", party: "Grey Party"}
            ]
          }
        ]
      }
    };

    this.showMenu = this.showMenu.bind(this);
    this.showPreview = this.showPreview.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.savePDF = this.savePDF.bind(this);

    this.updateBallotState = this.updateBallotState.bind(this);

    this.ballotRef = React.createRef();
  }

  // functions for top buttons

  toggleMenu() {
    this.setState({
        visibleMenu: !this.state.visibleMenu
    });
  }

  showMenu() {
    if (!this.state.visibleMenu){
      this.toggleMenu();
    }
    console.log("showMenu");
  }

  showPreview() {
    if (this.state.visibleMenu){
      this.toggleMenu();
    }
    console.log("showPreview");
  }

  savePDF() {
    this.showPreview();
    this.render();

    domtoimage.toBlob(document.getElementById('ballot2pdf'))
    .then(function (blob) {
      saveAs(blob, 'FVballot.png');
    });
  }

  updateBallotState(e){
    const target = e.target;
    const value = target.value;
    const name = target.name;

    let newBallotState = Object.assign({}, this.state.ballotState);
    newBallotState[name] = value

    this.setState({ballotState: newBallotState})
  }

  componentDidMount() {
    const height = document.getElementById('ballot2pdf').offsetHeight;
    this.setState({ballotHeight: height});
  }

  componentDidUpdate() {
    const height = document.getElementById('ballot2pdf').offsetHeight;
    if (height != this.state.ballotHeight){
      this.setState({ballotHeight: height});
    }
  }

  render() {

    console.log(this.state);

    return (
      <div className="col_flex">
        <div className="title_text">
          FairVote Sample RCV Ballot
        </div>
        <div className="subtitle_text">
          Edit and download a sample single-page,
          grid ballot for a ranked choice election.
        </div>
        <br/>
        <div className="row_flex">
          <button
            onClick={this.showMenu}
            id={!this.state.visibleMenu ? "bigButton" : "selectedBigButton"}>
            Edit Ballot
          </button>
          <button
            onClick={this.showPreview}
            id={this.state.visibleMenu ? "bigButton" : "selectedBigButton"}>
            Preview Ballot
          </button>
          <button
            onClick={this.savePDF}
            id="bigButton">
            Download (PNG)
          </button>
        </div>
        <br />
        <div className="ballotContainer">
          <div className={this.state.visibleMenu ? "bottomBallot" : "topBallot"}>
            <BallotPreview
              ballotHeight={this.state.ballotHeight}
              visible={this.state.visibleMenu}
              ballotState={this.state.ballotState}/>
          </div>
          <div className={this.state.visibleMenu ? "topBallot" : "bottomBallot"}>
            <BallotEdit
              ballotHeight={this.state.ballotHeight}
              visible={!this.state.visibleMenu}
              ballotState={this.state.ballotState}
              handleChange={this.updateBallotState}/>
          </div>
        </div>
      </div>
    );
  }
}

//          <div className={this.state.visibleMenu ? "bottomBallot" : "topBallot"}>
//          <div className={this.state.visibleMenu ? "topBallot" : "bottomBallot"}>


// ========================================

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
