require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

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

// get random number in range
function getRangeRandom(low, high){
  return Math.floor(Math.random() * (high - low) + low);
}

// get rotate value(+/-) within[0,30]
function get30DegreeRandom(){ 
  return ((Math.random() > 0.5? '' : '-') + Math.floor((Math.random() * 30)));
}

class ControllerUnit extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var controllerUnitClassName = "controller-unit";
    if(this.props.arrange.isCenter) {
      controllerUnitClassName += " isCenter";
      if(this.props.arrange.isInverse) {
        controllerUnitClassName += " is-inverse"
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}> </span>
    );
  }
}

class AppComponent extends React.Component {
  constructor() {
    super();
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX: [0,0],
        rightSecX: [0,0],
        y: [0,0]
      },
      vPosRange: {
        x: [0,0],
        topY: [0,0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        // {
        //   pos:{
        //     left: '0',
        //     top: '0'
        //   }
        //   rotate: 0，        // rotation angle 
        //   isInverse: false   // current img status , false: pic, ture: text
        //   isCenter: false    // whether img is centered 
        // }
      ]
    }
  }
  
  //inverse picture
  //@param index of current inversal img
  //@return {function}, a closure function, return the real func that need excute
  inverse(index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      //console.log(imgsArrangeArr[index].isInverse);
      this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
    }.bind(this);
  }



  // position all images
  // @param centerIndex: set which img as center image
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        //top image state
        imgsArrangeTopArr =  [],
        topImgNum = Math.floor(Math.random() * 2), // select 1\2
        topImgSpliceIndex = 0,

        //center image state
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
        //position center image, center image do not need rotate
        imgsArrangeCenterArr[0] = {
           pos: centerPos,
           rotate: 0,
           isCenter: true
        };

        //find postion state of top img
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //position top image
        imgsArrangeTopArr.forEach(function (value, index){
          imgsArrangeTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: get30DegreeRandom(),
            isCenter: false
          }; 
        });


        //position images on sides
        for(let i = 0, j=imgsArrangeArr.length, k=j/2; i<j; i++){
          var hPosRangeLORX = null;
          // first half position to left, second half position to right
          if( i < k){
            hPosRangeLORX = hPosRangeLeftSecX;
          } else{
            hPosRangeLORX = hPosRangeRightSecX;
          }
          imgsArrangeArr[i] = {
            pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            rotate: get30DegreeRandom(),
            isCenter: false
        };
        
      }

      debugger;

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) { 
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]); 

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });

  }

  /*use rearrange, centralize selected picture\
    @param index  
    @return function
  */

  center(index) {
    return function(){
      this.rearrange(index);
    }.bind(this);
  }

     //initial position for every images
  componentDidMount() {
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW =  Math.floor(stageW / 2),
        halfStageH =  Math.floor(stageH / 2);
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imageFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.floor(imgW / 2),
        halfImgH = Math.floor(imgH / 2);
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    // position range of left and right component
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - 3*halfImgW;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    //position range of top component
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - 3*halfImgH;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  }
  
  render() {
    var controllerUnits = [],
        imgFigures = [];
    imageData.forEach(function(element, index) {
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }

      imgFigures.push(<ImgComponent key={index} data={element} ref={'imageFigure'+index} arrange={this.state.imgsArrangeArr[index]}
                        inverse = {this.inverse(index)} center = {this.center(index)}/>);
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                        inverse = {this.inverse(index)} center = {this.center(index)} />)
    }.bind(this));
    return (
      <section className = "stage" ref="stage">
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
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  //handle img onclick event
  handleClick(e) {
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
    
  }
  render() {
    var styleObj = {};
     //if 'props' have set postion value, use
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }
    //if 'props' have set rotate value, use
    if(this.props.arrange.rotate){
      ['Moz', 'ms', 'Webkit', ''].forEach(function (value){
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this)); 
    }
    var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
        console.log(imgFigureClassName);
    
    return (
      <figure className = {imgFigureClassName} style={styleObj} onClick = {this.handleClick}>
        <img src={this.props.data.url} 
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className = "img-title">{this.props.data.title}</h2>
          <div className = "img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.description}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

ImgComponent.defaultProps = {
};

export default AppComponent;
