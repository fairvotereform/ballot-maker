import React from 'react';
import ReactDOM from 'react-dom';
//import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
//import jsPDF from 'jspdf';
import './index.css';
import './fonts/Poppins-Regular.ttf'
import './fonts/Overpass-ExtraLight.ttf'
import fv from './FV-resize150.png'
import bubble from './bubble.png'
import instruct1 from './instruction1.png';
import instruct2 from './instruction2.png';
import instruct3 from './instruction3.png';

function BallotInstructions(){
  return (
    <div id="ballotInstructions">
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

class ContestBubbleGrid extends React.Component {

  bubbleStyleOuter(coordinate){
    return({
      gridColumn: coordinate[0] + " / span 1",
      gridRow: coordinate[1] + " / span 1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      borderLeft: "2px solid black",
      borderTop: "2px solid black"
    })
  };

  render(){

    let bubbleStyleInner = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      maxWidth: (this.props.n_candidates * 5) + "%",
      margin: "auto"
    };

    let bubbleGridStyle = {
      gridColumn: "2 / span 1",
      gridRow: "2 / span 1",
      display: "grid",
      gridTemplateColumns: "repeat(" + this.props.n_candidates + ", 1fr)",
      gridTemplateRows: "repeat(" + this.props.n_candidates + ", 1fr)"
    };

    let array = Array.from(Array(this.props.n_candidates).keys());
    let results = [];

    // Since you only want pairs, there's no reason
    // to iterate over the last element directly
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        results.push([array[i]+1, array[j]+1]);
      }
    }

    let bubbles = results.map((coordinate, index) =>
      <div key={index} style={this.bubbleStyleOuter(coordinate)}>
        <img
          style={bubbleStyleInner}
          src={bubble} alt="bubble"/>
      </div>
    );

    return(
      <div style={bubbleGridStyle}>
      {bubbles}
      </div>
    );
  }
}

class ContestRankHeader extends React.Component {

  ordinalStyle(ordinal){
    return(
      {
        gridColumn: ordinal + " / span 1",
        gridRow: "1 / span 1",
        display: "flex",
        flexWrap: "nowrap",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderLeft:  "2px solid black",
        height: "var(--grid-row1)"
      }
    );
  }

  renderOrdinals(n_candidates){
    let shortOrdinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th",
                         "8th", "9th", "10th"];
    let longOrdinals = ["First", "Second", "Third", "Fourth", "Fifth",
                        "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];

    let ordinalsDivs = Array.from(Array(n_candidates).keys()).map(

      (number, index) =>

      <div key={index} style={this.ordinalStyle(number+1)}>
        <div className="longOrdinal">
          {longOrdinals[number]} choice
        </div>
        <div className="shortOrdinal">
          {shortOrdinals[number]}
        </div>
      </div>
    );

    return(ordinalsDivs);
  }

  render() {

    const divStyle = {
      gridColumn: "2 / span 1",
      gridRow: "1 / span 1",
      display: "grid",
      gridTemplateColumns: "repeat(" + this.props.n_candidates + ", 1fr)",
    };

    return(
      <div style={divStyle}>
      {this.renderOrdinals(this.props.n_candidates)}
      </div>
    );
  }
}

function BallotHeaderPreview(props) {
  return (
    <div className="officialballot">
        <div id="fv"><img src={fv} alt="fv"/></div>
        <div className="election">
            <div className="line1"><b>FairVote Sample Ballot</b></div>
            <div className="line2"><b>{props.ballotState.place}</b></div>
            <div className="line2"><b>{props.ballotState.date}</b></div>
            <div className="line2"><b>{props.ballotState.electionName}</b></div>
        </div>
    </div>
  );
}

function BallotHeaderEdit(props) {
  return (
    <div className="officialballot" id="ballotHeaderEdit">
        <div id="fv"><img src={fv} alt="fv"/></div>
        <div className="election">
            <div className="line1"><b>FairVote Sample Ballot</b></div>
            <div className="line2">
              <b>
                  <EditForm
                    size={50}
                    value={props.ballotState.place}
                    name="place"
                    handleChange={props.handleChange}/>
              </b>
            </div>
            <div className="line2">
              <b>
                  <EditForm
                    size={50}
                    value={props.ballotState.date}
                    name="date"
                    handleChange={props.handleChange}/>
              </b>
            </div>
            <div className="line2">
              <b>
                  <EditForm
                    size={50}
                    value={props.ballotState.electionName}
                    name="electionName"
                    handleChange={props.handleChange}/>
              </b>
            </div>
        </div>
    </div>
  );
}

function EditForm(props){
  return (
    <form>
      <label>
        <input
          style={{height: props.height + "px"}}
          type="text"
          size={props.size}
          value={props.value}
          name={props.name}
          onChange={props.handleChange}/>
      </label>
    </form>
  );
}

function ContestTitlePreview(props){
  return(
    <div>
      {props.position}
    </div>
  );
}

function ContestTitleEdit(props){
  return(
    <div>
      <EditForm
        size={50}
        height={10}
        value={props.position}
        name="position"
        handleChange={props.handleChange}/>
    </div>
  );
}

function ContestInstructionsPreview(props){
  return(
    <div className="contestInstructions">
    Rank up to {props.n_candidates} candidates.
    <br/><br/>
    Mark no more than 1 oval in each column.
    <br/><br/>
    {props.n_to_elect} to be elected.
    </div>
  );
}

function ContestInstructionsEdit(props){
  return(
    <div className="contestInstructions">
    Rank up to {props.n_candidates} candidates.
    <br/><br/>
    Mark no more than 1 oval in each column.
    <br/><br/>
    <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
      <EditForm
        size={1}
        height={10}
        value={props.n_to_elect}
        name="n_to_elect"
        handleChange={props.handleChange}/>
       <div>to be elected.</div>
     </div>
    </div>
  );
}

function ContestCandidatePreview(props){
  return(
    <div className="contestCandidateOuter">
      <div className="contestCandidateInnerPreview">
        <div className="candidateName">
          {props.candidate.name}
        </div>
      {props.candidate.party}
      </div>
    </div>
  );
}

class ContestCandidateEdit extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    const name = e.target.name;
    const value = e.target.value;

    let newCandidate = Object.assign({}, this.props.candidate);
    newCandidate[name] = value

    this.props.handleChange(
      {updatedCandidate: newCandidate, candIdx: this.props.candIdx}
    );
  }

  render(){
    return(
      <div
      className="contestCandidateOuter"
      id={"contest$" + this.props.contestIdx + "_candidate$" + this.props.candIdx}>
        <div className="contestCandidateInnerEdit">
          <div className="candidateName">
            <EditForm
              size={23}
              value={this.props.candidate.name}
              name="name"
              handleChange={this.handleChange}/>
          </div>
          <EditForm
            size={23}
            value={this.props.candidate.party}
            name="party"
            handleChange={this.handleChange}/>
        </div>
      </div>
    );
  }
}

function ContestCandidatesPreview(props){

  let candidates = props.candidates.map((candidate, index) =>
    <ContestCandidatePreview
      key={index}
      candIdx={index}
      candidate={candidate} />
  );

  return(
    <div className="contestCandidateContainer">
      {candidates}
    </div>
  );
}

class ContestCandidatesEdit extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    const updatedCandidate = e.updatedCandidate;
    const candIdx = e.candIdx;

    let newCandidateList = this.props.candidates.slice();
    newCandidateList[candIdx] = updatedCandidate;

    this.props.handleChange(
      {target:{name: "candidates", value: newCandidateList}}
    );
  }

  render(){

    let candidates = this.props.candidates.map((candidate, index) =>
      <ContestCandidateEdit
        key={index}
        candIdx={index}
        contestIdx={this.props.contestIdx}
        candidate={candidate}
        handleChange={this.handleChange}/>
    );

    return(
      <div className="contestCandidateContainer">
        {candidates}
      </div>
    );
  }
}

function ContestPreview(props){
  return(
    <div className="contest">
      <div className="contestTitle">
        <ContestTitlePreview position={props.contestInfo.position}/>
      </div>
      <div className="contestBody">
        <ContestInstructionsPreview
          n_to_elect={props.contestInfo.n_to_elect}
          n_candidates={props.contestInfo.candidates.length}/>
        <ContestRankHeader
          n_candidates={props.contestInfo.candidates.length}/>
        <ContestCandidatesPreview
          candidates={props.contestInfo.candidates}/>
        <ContestBubbleGrid
          n_candidates={props.contestInfo.candidates.length}/>
      </div>
    </div>
  );
}

class ContestEdit extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    const value = e.target.value;
    const name = e.target.name;

    this.props.handleChange(
      {name: name, value: value, idx: this.props.contestIdx}
    );
  }

  render(){

    return(
      <div className="contest">
        <div className="contestTitle" id={"contest$" + this.props.contestIdx}>
          <ContestTitleEdit
            position={this.props.contestInfo.position}
            handleChange={this.handleChange}/>
        </div>
        <div className="contestBody">
          <ContestInstructionsEdit
            n_to_elect={this.props.contestInfo.n_to_elect}
            n_candidates={this.props.contestInfo.candidates.length}
            handleChange={this.handleChange}/>
          <ContestRankHeader
            n_candidates={this.props.contestInfo.candidates.length}/>
          <ContestCandidatesEdit
            contestIdx={this.props.contestIdx}
            candidates={this.props.contestInfo.candidates}
            handleChange={this.handleChange}/>
          <ContestBubbleGrid
            n_candidates={this.props.contestInfo.candidates.length}/>
        </div>
      </div>
    );
  }
}

function BallotPreview(props){

  const contests = props.ballotState.contests.map((contest, index) =>
    <ContestPreview key={index} contestInfo={contest}/>
  );

  return (
    <div className={props.visible ? "topBallot" : "bottomBallot"}>
      <div className="row_flex">
        <div className="stripFiller">
        </div>
        <div className="ballot" id="ballot2pdf">
            <BallotHeaderPreview ballotState={props.ballotState}/>
            <BallotInstructions />
            {contests}
        </div>
        <div className="stripFiller">
        </div>
      </div>
    </div>
  );
}

class CandidateRemoveButton extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.removeCandidate = this.removeCandidate.bind(this);
  }

  removeCandidate(){
    this.props.handleChange(this.props.candidateIdx);
  }

  render(){
    return(
      <div className="sideBarCandidateButtonContainer">
        <button
          id="sideBarCandidateButtonRemove"
          onClick={this.removeCandidate}>
          -
        </button>
      </div>
    );
  }
}

class ContestRemoveButtons extends React.Component{

  constructor(props, context) {
    super(props, context);

    this.removeContest = this.removeContest.bind(this);
    this.removeCandidate = this.removeCandidate.bind(this);
    this.addCandidate = this.addCandidate.bind(this);
  }

  addCandidate(){

    let newCandidateList = this.props.contestInfo.candidates.slice();
    newCandidateList[newCandidateList.length] = {name: "", party: ""};

    this.props.handleChange(
      {
        name: "candidates",
        value: newCandidateList,
        idx: this.props.contestIdx
      }
    );
  }

  removeCandidate(candidateIdx){

    let newCandidateList = this.props.contestInfo.candidates.slice();
    newCandidateList.splice(candidateIdx, 1)

    this.props.handleChange(
      {
        name: "candidates",
        value: newCandidateList,
        idx: this.props.contestIdx
      }
    );
  }

  removeContest(){
    this.props.handleChange(
      {
        name: "",
        value: "",
        idx: this.props.contestIdx
      }
    );
  }

  render(){

    const fillerStyle = {
        height: 40 + "px",
        width: "100%",
        backgroundColor: "white"
    }

    let candidateButtons = this.props.contestInfo.candidates.map(

      (candidate, index) =>

      <CandidateRemoveButton
        key={index}
        candidateIdx={index}
        handleChange={this.removeCandidate}/>
    );

    return(
      <div className="col_flex_botMarg">
        <button
          id="sideBarContestButton"
          onClick={this.removeContest}>
          -
        </button>
        <div style={fillerStyle}></div>
        <button
          id="sideBarCandidateButtonAdd"
          onClick={this.addCandidate}>
          Add Candidate
        </button>
        <div style={fillerStyle}></div>
        {candidateButtons}
      </div>
    );
  }
}

class EditBar extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  render(){

    const topFillerStyle = {
        height: (380 + 102 + 10 + 10 + 10) + "px",
        width: "100%",
        backgroundColor: "white"
    }

    const contests = this.props.ballotState.contests.map((contest, index) =>
      <ContestRemoveButtons
        key={index}
        contestIdx={index}
        contestInfo={contest}
        handleChange={this.props.handleChange}/>
    );

    return(
      <div className="col_flex">
      <div style={topFillerStyle}></div>
      {contests}
      </div>
    );
  }
}

class BallotEdit extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.updateContestState = this.updateContestState.bind(this);
    this.addContest = this.addContest.bind(this);
  }

  addContest(){

    let newContest = {
      position: "",
      n_to_elect: "One",
      candidates: [
        {name: "", party: ""},
        {name: "", party: ""}
      ]
    };

    let newContestList = this.props.ballotState.contests.slice();
    newContestList[newContestList.length] = newContest;

    this.props.handleChange({target: {name: 'contests', value: newContestList}});
  }

  updateContestState(contestUpdate){

    const name = contestUpdate.name;
    const value = contestUpdate.value;
    const contestIdx = contestUpdate.idx;

    let newContestList = this.props.ballotState.contests.slice();
    if (name){
      newContestList[contestIdx][name] = value;
    } else {
      newContestList.splice(contestIdx, 1);
    }

    this.props.handleChange({target: {name: 'contests', value: newContestList}});
  }

  render(){

    const contests = this.props.ballotState.contests.map((contest, index) =>
      <ContestEdit
        key={index}
        contestIdx={index}
        contestInfo={contest}
        handleChange={this.updateContestState}/>
    );

    return (
      <div className={this.props.visible ? "topBallot" : "bottomBallot"}>
        <div className="row_flex">
          <div className="strip">
            <EditBar
              ballotState={this.props.ballotState}
              handleChange={this.updateContestState}/>
          </div>
          <div className="ballot" id="ballot2edit">
            <BallotHeaderEdit
              ballotState={this.props.ballotState}
              handleChange={this.props.handleChange}/>
            <BallotInstructions />
            {contests}
            <button
              id="contestAddButton"
              onClick={this.addContest}>
              Add Contest
            </button>
          </div>
          <div className="strip">
          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      visibleMenu: false,
      ballotState: {
        place: "Anytown, USA",
        date: "April 35, 2020",
        electionName: "Council Election",
        contests: [
          {
            position: "President",
            n_to_elect: "One",
            candidates: [
              {name: "joey", party: "winner party"},
              {name: "joey2", party: "winner party"},
              {name: "joey3", party: "winner party"}
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
    this.cleanState = this.cleanState.bind(this);
  }

  cleanState(){
    if (this.state.ballotState.place.length == 0){
      let newState = Object.assign({}, this.state.ballotState);
      newState["place"] = "--";
      this.setState({ballotState: newState});
    }
    if (this.state.ballotState.date.length == 0){
      let newState = Object.assign({}, this.state.ballotState);
      newState["date"] = "--";
      this.setState({ballotState: newState});
    }
    if (this.state.ballotState.electionName.length == 0){
      let newState = Object.assign({}, this.state.ballotState);
      newState["electionName"] = "--";
      this.setState({ballotState: newState});
    }
    for (let i = 0; i < this.state.ballotState.contests.length; i++) {
      if (this.state.ballotState.contests[i].position.length == 0){
        let newContestList = this.state.ballotState.contests.slice();
        newContestList[i]["position"] = "--";
        let newState = Object.assign({}, this.state.ballotState);
        newState["contests"] = newContestList;
        this.setState({ballotState: newState});
      }
      for (let j = 0; j < this.state.ballotState.contests[i].candidates.length; j++) {
        if (this.state.ballotState.contests[i].candidates[j].name == 0){
          let newCandidateList = this.state.ballotState.contests[i].candidates.slice();
          newCandidateList[j]["name"] = "--";
          let newContestList = this.state.ballotState.contests.slice();
          newContestList[i]["candidates"] = newCandidateList;
          let newState = Object.assign({}, this.state.ballotState);
          newState["contests"] = newContestList;
          this.setState({ballotState: newState});
        }
        if (this.state.ballotState.contests[i].candidates[j].party == 0){
          let newCandidateList = this.state.ballotState.contests[i].candidates.slice();
          newCandidateList[j]["party"] = "--";
          let newContestList = this.state.ballotState.contests.slice();
          newContestList[i]["candidates"] = newCandidateList;
          let newState = Object.assign({}, this.state.ballotState);
          newState["contests"] = newContestList;
          this.setState({ballotState: newState});
        }
      }
    }
  }

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

  render() {

    this.cleanState();
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
            onClick={this.showPreview}
            id={this.state.visibleMenu ? "bigButton" : "selectedBigButton"}>
            Preview Ballot
          </button>
          <button
            onClick={this.showMenu}
            id={!this.state.visibleMenu ? "bigButton" : "selectedBigButton"}>
            Edit Ballot
          </button>
          <button
            onClick={this.savePDF}
            id="bigButton">
            Download (PDF)
          </button>
        </div>
        <br />
        <div className="ballotContainer">
        <BallotEdit
            visible={!this.state.visibleMenu}
            ballotState={this.state.ballotState}
            handleChange={this.updateBallotState}/>
        <BallotPreview
          visible={this.state.visibleMenu}
          ballotState={this.state.ballotState}/>
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
