import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

export default class Map extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    //console.log("props",this.props);
    return (
      <div style={{ height: "100vh", width: "100%"}}>
        <GoogleMapReact center={this.props.Center}
          defaultZoom={this.props.Zoom}
        />
      </div>
    );
  }
}
