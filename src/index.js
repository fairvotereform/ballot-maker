import React from 'react';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './index.css';
import './fonts/Poppins-Regular.ttf'
import './fonts/Overpass-ExtraLight.ttf'
import fv from './FV-resize150.png'
import instruct1 from './instruction1.png';
import instruct2 from './instruction2.png';
import instruct3 from './instruction3.png';

class Contest extends React.Component {
  render(){
    return(<div className="contest"></div>);
  }
}

class Ballot extends React.Component {

  renderBallotHeader(props) {
    return (
      <div className="officialballot">
          <div id="fv"><img src={fv} alt="fv"/></div>
          <div className="election">
              <div className="line1"><b>FairVote Sample Ballot</b></div>
              <div className="line2"><b>{props.place}</b></div>
              <div className="line2"><b>{props.date}</b></div>
              <div className="line2"><b>{props.title}</b></div>
          </div>
      </div>
    );
  }

  renderBallotInstructions(){
    return (
      <div>
          <div className="instructionsTitle"><b>Instructions for Ranked Choice Voting</b></div>
          <div className="topInstructions">
              <div style={{marginRight: "5px"}}>
                  <b>Making selections</b>
                  <br/><br/>Rank candidates in the order of your choice.
                  <br/><br/>You may rank as many or as few candidates as you wish.
              </div>
              <div style={{marginLeft: "8px"}}>
                  <b>Fill in the oval...</b>
                  <br/><br/>• In the 1st column for your 1st choice
                  <br/><br/>• In the 2nd column for your 2nd choice
                  <br/><br/>• In the 3rd column for your 3rd choice, and so on.
              </div>
          </div>
          <div className="images">
              <div className="imgwrap"><img src={instruct1} alt="instruct1"/></div>
              <div className="imgwrap"><img src={instruct2} alt="instruct2"/></div>
              <div className="imgwrap"><img src={instruct3} alt="instruct3"/></div>
              <div className="txtwrap">Fill in the oval completely.</div>
              <div className="txtwrap">No more than 1 oval in a column.</div>
              <div className="txtwrap">No more than 1 oval for a candidate.</div>
          </div>
      </div>
    );
  }

  renderContest(){
    return <Contest n_to_rank={6} n_winners={1} position="Council"/>
  }

  render() {

    return (
      <div className="ballot" id="ballot">
        {this.renderBallotHeader(this.props)}
        {this.renderBallotInstructions()}
        {this.renderContest()}
      </div>
    );
  }
}

class ControlForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: "--place--",
      date: "--date--",
      electionName: "--electionName--"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value =  target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
      <div className="formField">
        <label>Place:</label>
        <input name="place" type="text" onChange={this.handleInputChange} />
      </div>
      <div className="formField">
        <label>Date:</label>
        <input name="date" type="text" onChange={this.handleInputChange} />
      </div>
      <div className="formField">
        <label>Election:</label>
        <input name="electionName" type="text"
            onChange={this.handleInputChange} />
      </div>
      </form>
    );
  }
}

class ControlPanel extends React.Component {

  savePDF() {
    const input = document.getElementById('ballot');
    const existingStyle = input.style;
    input.style.border = "none";
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'in', "letter");
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save("download.pdf");
    });
    input.style = existingStyle;
  }

  render(){
    return(
      <div className="controlPanel">
        <div className="controlTop">Edit the sample ballot:</div>
        <ControlForm />
        <button onClick={this.savePDF} className="controlBottom">
          Download PDF
        </button>
      </div>
    );
  }
}

class App extends React.Component {

  render() {

    const place = "Anchorage, Alaska";
    const title = "Primary Election";
    const date = "Aug 18, 2020";
    const position = "Council";

    return (
      <div>
        <div className="col_flex">
          <div className="title_text">
            FairVote Sample RCV Ballot
          </div>
          <div className="subtitle_text">
            Use the panel on the right to generate a sample single-page,
            grid-style ballot for a ranked-choice voting election.
          </div>
        </div>
        <div className="row_wrap_grid">
          <Ballot place={place} title={title} date={date} position={position}/>
          <ControlPanel/>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
