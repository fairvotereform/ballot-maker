import React from 'react';
import {ContestBubbleGrid, ContestRankHeader,
   BallotInstructions} from './CommonComponents';
import './index.css';
import fv from './FV-resize150.png'


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

function ContestPreview(props){

  let candidates = props.contestInfo.candidates.map((candidate, index) =>
    <ContestCandidatePreview
      key={index}
      candIdx={index}
      candidate={candidate} />
  );

  return(
    <div className="contest">
      <div className="contestTitle" style={{minHeight: "16px"}}>
        {props.contestInfo.position}
      </div>
      <div className="contestBody">
        <ContestInstructionsPreview
          n_to_elect={props.contestInfo.n_to_elect}
          n_candidates={props.contestInfo.candidates.length}/>
        <ContestRankHeader
          n_candidates={props.contestInfo.candidates.length}/>
        <div className="contestCandidateContainer">
          {candidates}
        </div>
        <ContestBubbleGrid
          n_candidates={props.contestInfo.candidates.length}/>
      </div>
    </div>
  );
}


function BallotPreview(props){

  let heightInches = props.ballotHeight/96;
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
            {heightInches} inches
          </div>
        </div>
      </div>
  }

  const contests = props.ballotState.contests.map((contest, index) =>
    <ContestPreview key={index} contestInfo={contest}/>
  );

  return (
    <div className="">
      <div className="row_flex">
        <div className="stripFiller"></div>
        <div className="paddingStripFiller" style={{width: "4px"}}></div>
        <div className="ballot" id="ballot2pdf">
          <BallotHeaderPreview ballotState={props.ballotState}/>
          <BallotInstructions ballotState={props.ballotState}/>
          {contests}
        </div>
        <div className="paddingStripFiller"></div>
        {measureColumn}
      </div>
    </div>
  );
}


export default BallotPreview
