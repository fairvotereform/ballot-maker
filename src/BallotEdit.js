import React from 'react';
import {ContestBubbleGrid, ContestRankHeader,
   BallotInstructions, ContestBubbleRow} from './CommonComponents';
import './index.css';
import fv from './FV-resize150.png'

function BallotHeaderEdit(props) {
  return (
    <div className="ballotPiece">
      <div className="ballotPieceLeft">
        <button id="sideButtonWide" onClick={props.toggleInstructions}>
          Add / Remove Instructions
        </button>
      </div>
      <div className="ballotPieceMid" style={{borderTop: "1px solid #aaa"}}>
        <div className="officialballot" id="ballotHeaderEdit">
            <div id="fv"><img src={fv} alt="fv"/></div>
            <div className="election">
                <div className="line1"><b>Sample Ballot</b></div>
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
      </div>
      <div className="ballotPieceRight">
      </div>
    </div>
  );
}

function EditForm(props){
  return (
    <form>
      <label>
        <input
          className="editForm"
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

function ContestTitleEdit(props){
  return(
    <div className="ballotPiece">
      <div className="ballotPieceLeft">
        <button id="sideButtonWide" onClick={props.removeContest}>
          Remove Contest
        </button>
      </div>
      <div className="ballotPieceMid" style={{minHeight: "16px"}}>
        <div>
          <div className="contestTitle">
            <EditForm
              size={50}
              height={11}
              value={props.position}
              name="position"
              handleChange={props.handleChange}/>
            </div>
          </div>
      </div>
      <div className="ballotPieceRight">
      </div>
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
          height={11}
          value={props.n_to_elect}
          name="n_to_elect"
          handleChange={props.handleChange}/>
         <div>to be elected.</div>
      </div>
    </div>
  );
}

function ContestColumnHeadersEdit(props){

  let addCandidateButton =
  <button id="sideButtonNarrow" onClick={props.addCandidate}>Add Row</button>
  if (props.n_candidates >= 13){
    addCandidateButton = <div></div>
  }

  return(
    <div className="ballotPiece">
      <div className="ballotPieceLeft">
        <div>
          {addCandidateButton}
        </div>
      </div>
      <div className="ballotPieceMid">
        <div>
          <div className="contestHeaders">
            <ContestInstructionsEdit
              n_candidates={props.n_candidates}
              n_to_elect={props.n_to_elect}
              handleChange={props.handleChange}/>
            <ContestRankHeader
            n_candidates={props.n_candidates}
            max_columns={props.max_columns}/>
          </div>
        </div>
      </div>
      <div className="ballotPieceRight">
      </div>
    </div>
  );
}

class ContestCandidateRowEdit extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.removeCandidate = this.removeCandidate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  removeCandidate(){

    let newCandidateList = this.props.candidates.slice();
    newCandidateList.splice(this.props.candIdx, 1);

    this.props.handleChange({
      target:{
        name: "candidates",
        value: newCandidateList
      }
    });
  }

  handleChange(e){

    const value = e.target.value;
    const name = e.target.name;

    let newCandidateList = this.props.candidates.slice();
    newCandidateList[this.props.candIdx][name] = value;

    this.props.handleChange({
      target:{
        name: "candidates",
        value: newCandidateList
      }
    });

  }

  render(){

    let candidateRowStyle = {};
    if (this.props.candIdx == this.props.candidates.length-1){
      candidateRowStyle = {
        borderBottom: "1px solid black",
        borderRadius: "2px"
      };
    }

    return(
      <div className="ballotPiece">
        <div className="ballotPieceLeft">
          <div className="candidateSideButtonContainer">
            <div className="candidateSideButton">
              <button id="sideButtonNarrow" onClick={this.removeCandidate}>
                Remove Row
              </button>
            </div>
          </div>
        </div>
        <div className="ballotPieceMid">
          <div>
            <div className="candidateRow" style={candidateRowStyle}>
              <div className="candidateInfo">
                <div className="contestCandidateOuterEdit">
                  <div className="contestCandidateInnerEdit">
                    <div className="candidateName">
                      <EditForm
                        size={23}
                        height={16}
                        value={this.props.candidate.name}
                        name="name"
                        handleChange={this.handleChange}/>
                    </div>
                    <EditForm
                      size={23}
                      height={16}
                      value={this.props.candidate.party}
                      name="party"
                      handleChange={this.handleChange}/>
                  </div>
                </div>
              </div>
              <div className="bubbleGridRow">
                <ContestBubbleRow
                n_candidates={this.props.candidates.length}
                max_columns={this.props.max_columns} />
              </div>
            </div>
            </div>
          </div>
        <div className="ballotPieceRight"></div>
      </div>
    );
  }
}


class ContestEdit extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.removeContest = this.removeContest.bind(this);
    this.addCandidate = this.addCandidate.bind(this);
  }

  addCandidate(){

    let newCandidateList = this.props.contestInfo.candidates.slice();

    if (newCandidateList.length <= 12){
      newCandidateList[newCandidateList.length] = {name: "", party: ""};

      this.props.handleChange(
        {
          name: "candidates",
          value: newCandidateList,
          idx: this.props.contestIdx
        }
      );
    }
  }

  removeContest(){
    this.props.handleChange(
      {name: "", value: "", idx: this.props.contestIdx}
    );
  }

  handleChange(e){
    const value = e.target.value;
    const name = e.target.name;

    this.props.handleChange(
      {name: name, value: value, idx: this.props.contestIdx}
    );
  }

  render(){

    let n_candidates = this.props.contestInfo.candidates.length;

    let candidates = this.props.contestInfo.candidates.map((candidate, index) =>
      <ContestCandidateRowEdit
        key={index}
        candIdx={index}
        candidates={this.props.contestInfo.candidates}
        candidate={candidate}
        max_columns={this.props.max_columns}
        handleChange={this.handleChange}/>
    );

    return(
      <div className="contest">
        <ContestTitleEdit
          position={this.props.contestInfo.position}
          removeContest={this.removeContest}
          handleChange={this.handleChange}/>
        <ContestColumnHeadersEdit
          n_to_elect={this.props.contestInfo.n_to_elect}
          n_candidates={n_candidates}
          max_columns={this.props.max_columns}
          handleChange={this.handleChange}
          addCandidate={this.addCandidate}/>
        {candidates}
      </div>
    );
  }
}


class BallotEdit extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.updateContestState = this.updateContestState.bind(this);
    this.addContest = this.addContest.bind(this);
    this.toggleInstructions = this.toggleInstructions.bind(this);
  }

  toggleInstructions(){

    let oldState = this.props.ballotState.includeInstructions;

    this.props.handleChange(
      {
        target:
        {
          name: "includeInstructions",
          value: !oldState
        }
      }
    );
  }

  addContest(){

    let newContest = {
      position: "",
      n_to_elect: "",
      candidates: [
        {name: "", party: ""}
      ]
    };

    let newContestList = this.props.ballotState.contests.slice();
    newContestList[newContestList.length] = newContest;

    this.props.handleChange(
      {
        target:
        {
          name: "contests",
          value: newContestList
        }
      }
    );
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

    //max candidates
    let max_candidates = Math.max.apply(Math, this.props.ballotState.contests.map(
      function (el) { return el.candidates.length })
    );

    const contests = this.props.ballotState.contests.map((contest, index) =>
      <ContestEdit
        key={index}
        contestIdx={index}
        contestInfo={contest}
        max_columns={max_candidates}
        handleChange={this.updateContestState}/>
    );

    return (
      <div>
      <div className="editBallot">
        <BallotHeaderEdit
          ballotState={this.props.ballotState}
          handleChange={this.props.handleChange}
          toggleInstructions={this.toggleInstructions}/>
        <div className="ballotPiece">
          <div className="ballotPieceLeft"></div>
          <div className="ballotPieceMid">
            <BallotInstructions ballotState={this.props.ballotState}/>
          </div>
          <div className="ballotPieceRight"></div>
        </div>
        {contests}
        <div className="ballotPiece">
          <div className="ballotPieceMid">
            <div class="addButtonContainer">
              <button
                id="contestAddButton"
                onClick={this.addContest}>
                Add Contest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}


export default BallotEdit
