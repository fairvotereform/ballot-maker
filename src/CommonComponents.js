import React from 'react';
import bubble from './bubble.png'
import instruct1 from './instruction1.png';
import instruct2 from './instruction2.png';
import instruct3 from './instruction3.png';

class BallotInstructions extends React.Component{

  render(){
    if (!this.props.ballotState.includeInstructions){
      return(<div></div>);
    }
    return (
      <div className="instructions">
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
}

class ContestRankHeader extends React.Component {

  invisibleRank(number){

    let s = {
        gridColumn: (number + 1) + " / span 1",
        gridRow: "1 / span 1",
        height: "var(--contest-rank-header-height)"
      };

    // if not all rank columns filled
    if (this.props.max_columns != this.props.n_candidates){
      // and if this is the last rank being filled
      if (number == this.props.n_candidates){
        // add a border on the right side
        s.borderLeft = "2px solid black";
      }
    }

    return(<div style={s}></div>);

  }

  visibleRank(number){

    let shortOrdinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th",
                         "8th", "9th", "10th", "11th", "12th", "13th",
                         "14th", "15th"];
    let longOrdinals = ["First", "Second", "Third", "Fourth", "Fifth",
                        "Sixth", "Seventh", "Eighth", "Ninth", "Tenth",
                        "Eleventh", "Twelfth", "Thirteenth", "Fourteenth",
                        "Fifteenth"];

    let s = {
        gridColumn: (number + 1) + " / span 1",
        gridRow: "1 / span 1",
        display: "flex",
        flexWrap: "nowrap",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderLeft:  "2px solid black",
        height: "var(--contest-rank-header-height)"
      };

    return(
      <div style={s}>
        <div className="longOrdinal">
          {longOrdinals[number]} choice
        </div>
        <div className="shortOrdinal">
          {shortOrdinals[number]}
        </div>
      </div>
    );
  }

  render() {

    const divStyle = {
      gridColumn: "2 / span 1",
      gridRow: "1 / span 1",
      display: "grid",
      gridTemplateColumns: "repeat(" + this.props.max_columns + ", 1fr)",
    };

    let ordinalsDivs = Array.from(Array(this.props.max_columns).keys()).map(
      (number, index) =>
      number >= this.props.n_candidates ? this.invisibleRank(number) : this.visibleRank(number)
    );

    return(
      <div style={divStyle}>
      {ordinalsDivs}
      </div>
    );
  }
}

class ContestBubbleRow extends React.Component {

  invisibleBubble(number){

    let bubbleStyleOuter = {
      gridColumn: (number + 1) + " / span 1",
      gridRow: "1 / span 1",
      height: "var(--contest-candidate-row-height-preview)"
    };

    // if not all rank columns filled
    if (this.props.max_columns != this.props.n_candidates){
      // and if this is the last rank being filled
      if (number == this.props.n_candidates){
        // add a border on the right side
        bubbleStyleOuter.borderLeft = "2px solid black";
      }
    }

    return(
      <div style={bubbleStyleOuter}></div>
    );
  }

  visibleBubble(number){

    let bubbleStyleOuter = {
      gridColumn: (number + 1) + " / span 1",
      gridRow: "1 / span 1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      borderLeft: "2px solid black",
      borderTop: "2px solid black",
      height: "var(--contest-candidate-row-height-preview)"
    };

    let bubbleStyleInner = {
      display: "flex",
      justifyContent: "center",
      alignItems: "stretch",
      maxWidth: (this.props.max_columns * 5) + "%",
      margin: "auto"
    };

    return(
      <div style={bubbleStyleOuter}>
        <img
          style={bubbleStyleInner}
          src={bubble} alt="bubble"/>
      </div>
    );
  }

  render() {

    const divStyle = {
      display: "grid",
      gridTemplateColumns: "repeat(" + this.props.max_columns + ", 1fr)",
    };

    let bubbleDivs = Array.from(Array(this.props.max_columns).keys()).map(
      (number, index) =>
      number >= this.props.n_candidates ? this.invisibleBubble(number) : this.visibleBubble(number)
    );

    return(
      <div style={divStyle}>
      {bubbleDivs}
      </div>
    );
  }
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

export {ContestBubbleGrid, ContestRankHeader, BallotInstructions, ContestBubbleRow}
