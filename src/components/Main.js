require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//let yeomanImage = require('../images/yeoman.png');
let imageData = require('../data/imageData.json');

// get image url
imageData = (function genImageURL(imgDataArr){
  for(var i=0, j=imgDataArr.length; i<j; i++){
    let singleImg = imgDataArr[i];
    singleImg.url = require('../images/' + singleImg.fileName);
    imgDataArr[i] = singleImg;
  }
  return imgDataArr;
})(imageData);

class AppComponent extends React.Component {
  render() {
    var controllerUnits = [],
        imgFigures = [];
    imageData.forEach(function(element) {
      imgFigures.push(<ImgComponent data={element}/>);
    });
    return (
      <section className = "stage">
        <section className = "img-sec">
          {imgFigures}
        </section>
        <nav className = "controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

class ImgComponent extends React.Component {
  render() {
    return (
      <figure className = "img-figure">
        <img src={this.props.data.url} 
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className = "img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

ImgComponent.defaultProps = {
};

export default AppComponent;
