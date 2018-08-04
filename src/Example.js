import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import Map from "./map.js";

let fltObj={};

const languages = [
  {
    name: "KLAX, Los Angeles International Airport",
    priority:1,
    lat: 34.052235,
    lon: -118.243683

  },
  {
    name: "KBOS, Boston International Airport",
    priority:1,
    lat: 42.36645,
    lon: -71.02146
  },
  {
    name: 'KATL,Atlanta International Airport',
    priority:1,
    lat: 33.749,
    lon: -84.388
  },
  {
    name: 'KORD,Chicago O hare Airport',
    priority:1,
    lat:41.97861,
    lon:-87.90472
  },
  {
    name: 'KEWR,Newark International Airport',
    priority:1,
    lat: 40.6895314,
    lon: -74.17446239999998
  },
  {
    name: 'KJFK,Jhon F kenedy Airport',
    priority:1,
    lat: 40.63972,
    lon: -73.77889
  },
  {
    name: 'KDAL,Dallas International Airport',
    priority:1,
    lat:32.89694,
    lon:-97.03806
  },
  {
    name: 'DAL123',
    priority: 3
  },
  {
    name: 'DAL456',
    priority:3
  },
  {
    name: 'DAL,Delta Airlines',
    priority:2
  },
  {
    name: 'United Airlines',
    priority:2
  },
  {
    name: 'UAL123',
    priority:3
  },
  {
    name: 'UAL456',
    priority:3
  },
  {
    name: 'DAL879',
    priority:3
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function findItemInFlightsArray(enteredValue){

  enteredValue = enteredValue.trim();
  let flightObj = languages.find(function(item) {
    return (item.name === enteredValue);
  });
  return flightObj;
}


function findPriorityEntryInSuggestionArray(suggestionsArray){

  let GreatestPriority = suggestionsArray[0].priority;
  let itemWithGreatestPriority = suggestionsArray[0];
  suggestionsArray.forEach( item => {
    if ( item.priority < GreatestPriority) {
      GreatestPriority = item.priority;
      itemWithGreatestPriority = item;
    }
  });
  console.log("check",itemWithGreatestPriority,GreatestPriority);
  return(itemWithGreatestPriority);
}


function getSuggestions(value) {

  const escapedValue = escapeRegexCharacters(value.trim());
  if (escapedValue === '') {
    return [];
  }
  const regex = new RegExp(escapedValue, 'i');
  return languages.filter(language => regex.test(language.name));
}



function getSuggestionValue(suggestion) {
  console.log("getSuggestionValue:",suggestion)
  fltObj=findItemInFlightsArray(suggestion.name);
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  //console.log("renderSuggestion:",suggestion.name);
  return (
    <span>{suggestion.name}</span>
  );
}

export class Example extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      noSuggestions: false,
      isSelectSuggestion:false,
      lat:28.53823,
      lon: -81.37739
    };
  }


  //Whenever Input changes or selection made using UP & Down arrow
  onChange = (event, { newValue, method }) => {

    console.log("onchange");
    this.setState({
      value: newValue,
    });

    if(fltObj && method==='click') {
      this.setState({
        lat:   fltObj.lat,
        lon:   fltObj.lon

      });
      fltObj={};
      //!!might need to set noSuggestion & isSelectSuggestion to false as a safe bound
    }

    if(method === 'down' || method === 'up') {
      this.setState({
          noSuggestions: false,
          isSelectSuggestion: true
      });

    }
    else {
      this.setState ({
        isSelectSuggestion: false
      });
    }

    console.log('Input box:')
    console.log('Selection: '+ method,this.state.isSelectSuggestion);
    console.log('NoSuggestion: '+ method,this.state.noSuggestions);
  };


//Whenever user presses enter
  onKeyPress = (e) => {
console.log("onKeyPress");
     if(e.key === 'Enter') {

       //on selection or Invalid data
       if (!this.state.suggestions.length ) {
         //on Selection
         if(this.state.isSelectSuggestion && !this.state.noSuggestions) {

           console.log("selection performed");
           console.log('OnisSelectSuggestion: ',this.state.isSelectSuggestion);
           console.log('NoSuggestions: ',this.state.noSuggestions);
           console.log("name:",this.state.value);

           let selectionItem =  findItemInFlightsArray(this.state.value);
          // console.log("selectionItem returned:",selectionItem);
            this.setState({
              value: selectionItem.name,
              lat:   selectionItem.lat,
              lon:   selectionItem.lon
            });
          // console.log( 'selection' + this.state);
         }
         else{
           //no Suggestions to show!
           console.log('Invalid Value!');
         }

       }

       //Single item only avaliable
       else if (this.state.suggestions.length ===1) {
         console.log("One value returned");
         this.setState({
           value: this.state.suggestions[0].name,
           lat: this.state.suggestions[0].lat,
           lon: this.state.suggestions[0].lon
         }
         );

       }


       //suggestionsArray present
       else {

      let item = findPriorityEntryInSuggestionArray(this.state.suggestions);
       console.log('Suggestion Array returned');
       this.setState({
         value:  item.name,
         lat: item.lat,
         lon: item.lon
       });
     }

   }
}



  onSuggestionsFetchRequested = ({ value }) => {
    const suggestions = getSuggestions(value);
    const isInputBlank = value.trim() === '';
    const noSuggestions = !isInputBlank && suggestions.length === 0;

    //if no suggestions, selection false
    if(noSuggestions){
      this.setState({
        isSelectSuggestion:false
      });
    }

    this.setState({
      suggestions,
      noSuggestions
    });
   console.log("Fetching suggestions:");
   console.log('Nosuggestions:',this.state.noSuggestions);
   console.log('Selection:',this.state.isSelectSuggestion);
  };


  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
    if (this.state.noSuggestions) {
      this.setState({
        noSuggestions: false,
        isSelectSuggestion:false
        }
      );
    }
      //console.log('onSuggestionsClearRequested:',this.state);
  };

  render() {

    const { value, suggestions,noSuggestions } = this.state;
    const inputProps = {
      placeholder: "Type Airport/flightId/Fixes..",
      value,
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
    };
    const center = { lat:this.state.lat, lng: this.state.lon };

    //console.log("center",center);
    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} />
          {
            noSuggestions &&
            <div className ="no-suggestions">
            No suggestions!
            </div>
          }
            <Map Center={center} Zoom={12} />

      </div>
    );
  }
}
