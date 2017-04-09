document.find=function(selector){
	return this.querySelector(selector);
};
document.findAll=function(selector){
	var result = this.querySelectorAll(selector),
		returnResult = [];
	if(result.length){
		for (var i = 0,length = result.length; i < length; i++) {
			returnResult[i] = result[i];
		}
		return returnResult;
	}else{
		return result;
	}
};
HTMLElement.prototype.find=function(selector){
	return this.querySelector(selector);
};
HTMLElement.prototype.findAll=function(selector){
	var result = this.querySelectorAll(selector),
		returnResult = [];
	if(result.length){
		for (var i = 0,length = result.length; i < length; i++) {
			returnResult[i] = result[i];
		}
		return returnResult;
	}else{
		return result;
	}
};
HTMLElement.prototype.addClass=function(){
	var classArr = arguments, s = this;
	for (var i = classArr.length - 1; i >= 0; i--) {
		s.classList.add(classArr[i]);
	}
	return s;
};
HTMLElement.prototype.removeClass=function(){
	var classArr = arguments, s = this;
	for (var i = classArr.length - 1; i >= 0; i--) {
		s.classList.remove(classArr[i]);
	}
	return s;
};
HTMLElement.prototype.toggleClass=function(){
	var classArr = arguments, s = this;
	for (var i = classArr.length - 1; i >= 0; i--) {
		s.classList.toggle(classArr[i]);
	}
	return s;
};
HTMLElement.prototype.hasClass=function(className){
	return this.classList.contains(className);
};
HTMLElement.prototype.attr = function(){
	var s = this;
	if (arguments.length == 1) {
		if (typeof(arguments[0]) == 'object') {
			var a = arguments;
			for(var i in a[0]){
				s.setAttribute(i,a[0][i]);
			}
		}else{
			return s.getAttribute(arguments[0]);
		}
	}else{
		s.setAttribute(arguments[0],arguments[1]);
	}
	return s;
}
if(HTMLElement.prototype.remove == undefined){
	HTMLElement.prototype.remove = function(){
		var s = this,parent = s.parentNode;
		return parent.removeChild(s);
	};
};