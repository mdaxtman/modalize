var modalize = (function(){
  var d = document;
  var w = window;
  var body = d.body;
  var af = w.requestAnimationFrame;

  var createCircleElement = function(color, size, opacity) {
    var circleElem = createSquareElement(color, size, opacity);
    circleElem.style.borderRadius = '50%';
    circleElem.classList.remove('modalize-square');
    circleElem.classList.add('modalize-circle');
    return circleElem;
  };
  
  var createSquareElement = function(color, size, opacity) {
    var squareElem = d.createElement('div');
    squareElem.classList.add('modalize-square');
    squareElem.style.background =  color || 'white';
    squareElem.style.height = size || '10px';
    squareElem.style.width = size || '10px';
    squareElem.style.opacity = opacity || '.3';
    return squareElem;
  };

  var animationTypes = {
    circle : createCircleElement,
    square : createSquareElement
  };

  var animationEvent = function(animationObject) {
    var element;
    if(animationTypes[animationObject.type]){
      element = animationTypes[animationObject.type](animationObject.color, animationObject.size, animationObject.opacity);
    }else{
      //default to circle
      element = animationTypes.circle(animationObject.color, animationObject.size, animationObject.opacity);
    }
      return function(e) {
        var elementPostion = e.target.getBoundingClientRect();
        console.log(elementPostion);
        e.target.appendChild(element);
      };
  };

  var createEventListeners = function(attributes, elements) {
    var currentEvent;
    var i;
    if(Array.isArray(attributes)){
      i = attributes.length;
      while(i--){
        currentEvent = animationEvent(attributes[i]);
        attributes[i].target.addEventListener(attributes[i].event || 'click', currentEvent);
      }
    }else{
      i = elements.length;
      while(i--){
        currentEvent = animationEvent(attributes);
        elements[i].addEventListener(attributes.event, currentEvent);
      }
    }
  };
  
  var getElementAttributes = function(target) {
    var i = target.length;
    var arr = [];
    while(i--){
      var attr = target[i].getAttribute('modalize-attr');
      if(attr){
        var attrObject = {};
        attr.split(';').forEach(function(prop){
          prop = prop.split(':');
          if(prop[0][0] === ' '){
            prop[0] = prop[0].slice(1);
          }
          if(prop[1] && prop[1][0] === ' '){
            prop[1] = prop[1].slice(1);
          }
          if(prop[0] && prop[1]){
            attrObject[prop[0]] = prop[1];  
          }
        });
        attrObject.target = target[i];
        arr.unshift(attrObject);
      }else{
        break;
      }
    }
    return arr;
  };

  return {
    add : function(obj) {
      obj = obj || {};
      obj.event  = obj.event || 'click';
      obj.animation = obj.animation || {};
      /*
        obj.target = ".class"
        obj.to = ".class"
        obj.event = 'click'
        obj.animation.type
        obj.animation.speed
        obj.animation.color
        obj.animation.opacity
      */
      if(obj.target){
        //target element exists
        var targetElements = document.querySelectorAll(obj.target);
        targetElements = Array.prototype.slice.call(targetElements);
        var len = targetElements.length;
        var i;
        var targetAttributes = getElementAttributes(targetElements);
        if(targetElements.length > 0 && targetAttributes.length === targetElements.length){
          //there are target elements and they do have attributes, will override the animation object
          createEventListeners(targetAttributes);
        }else if(targetElements.length > 0){
          //either no attrs for all elements or none at all either use animation object or defaults
          createEventListeners(obj, targetElements);
        }else{
          //error bad selector provided
        }
      }else{
        //error no selector provided
      }
    },   
  };

})();

modalize.add({
  target: '.target'
});
modalize.add({
  target: '.has-attr'
});
