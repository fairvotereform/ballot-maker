import React from 'react';
import {ContestBubbleGrid, ContestRankHeader,
   BallotInstructions, ContestBubbleRow} from './CommonComponents';
import './index.css';
import fv from './FV-resize150.png'

function BallotHeaderPreview(props) {
  return (
    <div className="ballotPiecePreview">
      <div className="officialballot">
          <div id="fv"><img src={fv} alt="fv"/></div>
          <div className="election">
              <div className="line1"><b>Sample Ballot</b></div>
              <div className="line2">
                <b>
                {props.ballotState.place}
                </b>
              </div>
              <div className="line2">
                <b>
                {props.ballotState.date}
                </b>
              </div>
              <div className="line2">
                <b>
                {props.ballotState.electionName}
                </b>
              </div>
          </div>
      </div>
    </div>
  );
}

function ContestTitlePreview(props){
  return(
    <div className="ballotPiecePreview" style={{minHeight: "16px"}}>
      <div className="contestTitle" style={{color: props.position ? "black": "#D0D3D4"}}>
        {props.position ? props.position : "?"}
      </div>
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

function ContestColumnHeadersPreview(props){
  return(
    <div className="ballotPiecePreview">
      <div className="contestHeaders">
        <ContestInstructionsPreview
          n_candidates={props.n_candidates}
          n_to_elect={props.n_to_elect}/>
        <ContestRankHeader
          n_candidates={props.n_candidates}
          max_columns={props.max_columns}/>
      </div>
    </div>
  );
}

function ContestCandidatePreview(props){

  let name = props.candidate.name;
  let party = props.candidate.party;

  let inner = <div className="contestCandidateInnerPreview"></div>
  if (name.length != 0 && party.length != 0){
    inner = <div className="contestCandidateInnerPreview">
              <div className="candidateName">
                {props.candidate.name}
              </div>
              <div>
                {props.candidate.party}
              </div>
            </div>
  }
  if (name.length == 0 && party.length != 0){
    inner = <div className="contestCandidateInnerPreview">
              <div>
                {props.candidate.party}
              </div>
            </div>
  }
  if (name.length != 0 && party.length == 0){
    inner = <div className="contestCandidateInnerPreview">
              <div className="candidateName">
                {props.candidate.name}
              </div>
            </div>
  }

  return(
    <div className="contestCandidateOuterPreview">
      {inner}
    </div>
  );
}

class ContestCandidateRowPreview extends React.Component{

  constructor(props, context) {
    super(props, context);
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
      <div className="ballotPiecePreview">
        <div className="candidateRow" style={candidateRowStyle}>
          <div className="candidateInfo">
            <ContestCandidatePreview candidate={this.props.candidate}/>
          </div>
          <div className="bubbleGridRow">
            <ContestBubbleRow
            n_candidates={this.props.candidates.length}
            max_columns={this.props.max_columns} />
          </div>
        </div>
      </div>
    );
  }
}


class ContestPreview extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  render(){

    let n_candidates = this.props.contestInfo.candidates.length;

    let candidates = this.props.contestInfo.candidates.map((candidate, index) =>
      <ContestCandidateRowPreview
        key={index}
        candIdx={index}
        max_columns={this.props.max_columns}
        candidates={this.props.contestInfo.candidates}
        candidate={candidate}/>
    );

    return(
      <div className="contest">
        <ContestTitlePreview
          position={this.props.contestInfo.position}/>
        <ContestColumnHeadersPreview
          n_to_elect={this.props.contestInfo.n_to_elect}
          n_candidates={n_candidates}
          max_columns={this.props.max_columns}/>
        {candidates}
      </div>
    );
  }
}


class BallotPreview extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  render(){

    //max candidates
    let max_candidates = Math.max.apply(Math, this.props.ballotState.contests.map(
      function (el) { return el.candidates.length })
    );

    //ballot height and measurement strip
    let heightInches = this.props.ballotHeight/96;
    heightInches = Math.round(heightInches * 100) / 100;

    let heightWarning = "";
    let measureColumn =
      <div className="stripMeasure">
        <div className="letterSizeColumn">
          <div className="measureText">
          standard letter length: 11 inches
          </div>
        </div>
      </div>

    if (heightInches > 11){
      heightWarning = "Ballot will not fit on standard letter paper!";
      measureColumn =
        <div className="stripMeasure">
          <div className="letterSizeColumn">
            <div className="measureText">
              standard letter length: 11 inches
            </div>
          </div>
          <div className="extraSizeColumn">
            <div className="measureText">
              {heightInches > 11.05 ? heightInches + " inches" : ""}
            </div>
          </div>
        </div>
    }

    const contests = this.props.ballotState.contests.map((contest, index) =>
      <ContestPreview
        key={index}
        contestIdx={index}
        contestInfo={contest}
        max_columns={max_candidates}/>
    );

    return (
      <div className="row_flex">
        <div className="stripFiller" style={{height: this.props.ballotHeight}}></div>
        <div className="previewBallot" id="ballot2pdf">
          <BallotHeaderPreview
            ballotState={this.props.ballotState}
            toggleInstructions={this.toggleInstructions}/>
          <div className="ballotPiecePreview">
            <BallotInstructions ballotState={this.props.ballotState}/>
          </div>
          {contests}
          <div className="credit">
            <div className="creditText">
              -This sample ballot was created by FairVote-
            </div>
          </div>
        </div>
        <div className="paddingStripFiller"></div>
        {measureColumn}
      </div>
    );
  }
}


export default BallotPreview
