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
    return (
      <section className = "stage">
        <section className = "img-sec">
        </section>
        <nav className = "controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
