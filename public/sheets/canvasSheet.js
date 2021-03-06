paper.install(window);
console.log("Start!!");
var mouse_where = "canvas";
var mouse_action = "";
var navbar_whichVector = "BV";
var auxline_whetherDisplay = false;
var cross_memo = new Object();

var circle_group      = new Group(),
	vector_group      = new Group(),
	auxline_gruop     = new Group(),
	crossField_group  = new Group(),
	crossVector_group = new Group();

//styles
var circle_style = {
	radius: 25,
	fillColor: '#0000FF',
	hover_fillColor: '#00BFFF'
};
var becVector_style = {
	type: "BV",
	name: "normalVector",
	strokeColor: '#1E90FF',
	hover_strokeColor: '#00BFFF',
	proto_strokeColor: '#1E90FF',
	strokeJoin: 'round'
};
var sinVector_style = {
	type: "LTV",
	name: "normalVector",
	strokeWidth: 5,
	strokeColor: '#1E90FF',
	hover_strokeColor: '#00BFFF',
	proto_strokeColor: '#1E90FF'
};
var notVector_style = {
	type: "NV",
	name: "normalVector",
	strokeColor: '#FF4500',
	hover_strokeColor: "#FF7F50",
	proto_strokeColor: '#FF4500',
	strokeJoin: "round"
}
var eiVector_style = {
	type: "EIV",
	name: "normalVector",
	strokeColor:'#00BFFF',
	hover_strokeColor: '#1E90FF',
	proto_strokeColor: '#00BFFF',
	strokeWidth: 4,
	dashArray: [10, 12]
};
var auxDashLine_style = {
	type: "ADL",
	strokeColor:'gray',
	strokeWidth: 4,
	dashArray: [10, 12],
	display_opacity: 0.5
};
var crossField_style = {
	opacity: 0.6,
	closed: true,
	hover_opacity: 0.8,
	proto_opacity: 0.6
}
var crossVector_style = {
	opacity: 0.5,
	name: 'transitionalCrossingVector'
}

main();

function main() {
	layerSetting();
	navbar_listener();
}
function onMouseDown(event) {
	judgement("circle_create") && createCircle(event.point);
}
function createCircle(eventPoint) {
	var circle_createData = {};

	circleDataSetting();
	drawCircle(circle_createData);
	
	function circleDataSetting() {
		circle_createData = circle_style;
		circle_createData.center = eventPoint;
	}
	function drawCircle(circle_createData) {
		var nowCircle = new Path.Circle(circle_createData);
		nowCircle.setCircleListener();

		circle_group.addChild(nowCircle);
	}
}
function layerSetting() {
	vector_group.insertBelow(circle_group);
	crossVector_group.insertBelow(vector_group);
	crossField_group.insertBelow(crossVector_group);
	auxline_gruop.insertBelow(crossField_group);
}
function judgement(behavior, defendant) {
	var conclusion = new Boolean();

	if (behavior === "circle_create"){
		var conditionA = mouse_where === 'canvas',
			conditionB = mouse_where === 'crossfield';
		conclusion = (conditionA || conditionB) ? true : false;
	}else if(behavior === "form_call"){
		conclusion = (mouse_where === 'circle') ? true : false;
	}else if(behavior === "vector_create"){
		conclusion = (mouse_where !== 'circle') ? true : false;
	}else if(behavior === "vector_create_afterComplete"){
		conclusion = (mouse_action === 'vector_create') ? true : false;
	}else if(behavior === "vector_create_afterComplete_hover"){
		var conditionA = mouse_action !== 'vector_create',
			conditionB = mouse_action !== 'vector_cross';
		conclusion = (conditionA && conditionB) ? true : false;
	}else if(behavior === "vector_cross"){
		var conditionA = mouse_where !== 'circle',
			conditionB = mouse_action !== 'vector_create',
			conditionC = mouse_action === 'vector_cross' ? defendant.name === 'cross_startedVector'
														 : true;
		conclusion = (conditionA && conditionB && conditionC) ? true : false;
	}else if(behavior === "vector_cross_saveDraggingVector"){
		conclusion = (mouse_action === 'vector_cross') ? true : false;
	}else if(behavior === "vector_cross_complete"){
		var conditionA = mouse_action === 'vector_cross',
			conditionB = defendant.name === 'cross_startedVector';
			conditionC = cross_memo.isCrossReady === true;
		conclusion = (conditionA && conditionB && conditionC) ? true : false;
	}else if(behavior === "vector_cross_ReadyOrFail"){
		var conditionA = mouse_action === 'vector_cross',
			conditionB = defendant.name === 'normalVector';
		conclusion = (conditionA && conditionB) ? true : false;
	}else if(behavior === "vector_cross_fail"){
		var conditionA = mouse_action === 'vector_cross',
			conditionB = defendant.name !== 'normalVector';
		conclusion = (conditionA && conditionB) ? true : false;
	}else if(behavior === "vector_cross_afterCross"){
		conclusion = (mouse_action === 'vector_cross') ? true : false;
	}else if(behavior === "crossfield_hover"){
		conclusion = (mouse_action !== 'vector_cross') ? true : false;
	}else{
		return undefined;
	}
	return conclusion;
}
function navbar_listener(){
	$("#BV").click(function(event) {
		navbar_whichVector = 'BV';
	});
	$("#LTV").click(function(event) {
		navbar_whichVector = 'LTV';
	});
	$("#NV").click(function(event) {
		navbar_whichVector = 'NV';
	});
	$("#EIV").click(function(event) {
		navbar_whichVector = 'EIV';
	});
	$('#ALB').click(function(event){
		auxline_toggle();
	})
	function auxline_toggle() {
		auxline_whetherDisplay = !auxline_whetherDisplay;
		auxline_gruop.children.forEach(function(auxDash) {
			auxDash.opacity = auxline_whetherDisplay ? auxDashLine_style.display_opacity : 0;				
		})
	}
}
Path.prototype.setCrossFieldListener = function() {
	this.onMouseEnter = function(event) {
		mouseInCrossField();
		judgement('crossfield_hover') && (this.opacity = crossField_style.hover_opacity);
	}
	this.onMouseLeave = function(event) {
		mouseOutCrossField();
		judgement('crossfield_hover') && (this.opacity = crossField_style.proto_opacity);
	}
	this.onMouseDown = function(event) {
		mouseInCrossField();
	}
	this.onMouseUp = function(event) {
	}
	this.onMouseDrag = function(event) {
	}
	this.onMouseMove = function(event) {
		mouseInCrossField();
	}
	this.onClick = function(event) {
		mouseInCrossField();
	}
	function mouseInCrossField() {
		mouse_where = 'crossfield';
	}
	function mouseOutCrossField() {
		mouse_where = '';
	}
};

Path.prototype.setVectorListener = function() {
	this.onMouseEnter = function(event){
		mouseInVector();
		judgement('vector_cross_ReadyOrFail', this) && crossStandBy.call(this);
		judgement("vector_create_afterComplete_hover") && (this.strokeColor = this.hover_strokeColor);
	}
	this.onMouseLeave = function(event){
		mouseOutVector();
		judgement('vector_cross_ReadyOrFail', this) && crossDisable.call(this);
		judgement("vector_create_afterComplete_hover") && (this.strokeColor = this.proto_strokeColor);
	}
	this.onMouseDown = function(event){
		mouseInVector();
		judgement('vector_cross', this) && beforeCrossing();
	}
	this.onMouseUp = function(event){
		cross_memo.isCrossReady ? judgement('vector_cross_complete', this) && crossCompleted()
								: judgement('vector_cross_fail', this) && crossFail();
		judgement('vector_cross_afterCross', this) && afterCrossCompleted.call(this);
	}
	this.onMouseDrag = function(event){
		judgement('vector_cross', this) && vectorCrossing.call(this, event);
	}
	this.onMouseMove = function(event){
		mouseInVector();
	}
	this.onClick = function(event){
		mouseInVector();
	}
	function mouseInVector() {
		mouse_where = 'vector';
	}
	function mouseOutVector() {
		mouse_where = 'canvas';
	}
	function beforeCrossing() {
		crossField_style.fillColor = giveRandomColor();

		function giveRandomColor() {
			var rgbTotalIsLow = true;
			while(rgbTotalIsLow){
				var r = Math.random(),
					g = Math.random(),
					b = Math.random();
				rgbTotalIsLow = (r + g + b) > 2 ? false : true; 
			}
			var randomColor = new Color(r,g,b);

			return randomColor;
		}
	}
	function vectorCrossing(event) {
		vectorCrossingInstruction.call(this);

		var startPosition = giveVectorStartPosition(this),
			endPosition   = giveVectorEndPosition(this);
		var startPoint = new Point(startPosition),
			endPoint   = new Point(endPosition),
			mousePoint = event.point;

		createVector(startPoint, mousePoint);
		createCrossField(startPoint, endPoint, mousePoint);
		isCrossReady && createGhostCrossVector();

		function vectorCrossingInstruction() {
			mouse_action = 'vector_cross';
			this.name = 'cross_startedVector';
			cross_memo.whoIsUsingCross = this.id;
		}
		function giveVectorStartPosition(vector) {
			var positionX = vector.segments[0].point.x,
				positionY = vector.segments[0].point.y;

			return [positionX, positionY];
		}
		function giveVectorEndPosition(vector) {
			var lastIndex = vector.segments.length - 1; 
			var positionX = vector.segments[lastIndex].point.x,
				positionY = vector.segments[lastIndex].point.y;

			return [positionX, positionY];
		}
		function createGhostCrossVector() {
			// var targetStartPoint   = cross_memo.targetVecotor.segments[0],
			// 	protoVector 	   = endPoint - startPoint,
			// 	ghostStartPosition = giveVectorStartPosition(cross_memo.targetVecotor);
			// var ghostStartPoint = new Point(ghostStartPosition),
			// 	ghostEndPoint   = targetStartPoint + protoVector;

			// createVector(ghostStartPoint, ghostEndPoint);
			changeName();
			function changeName() {

			}
		}
	}
	function crossStandBy() {
		cross_memo.isCrossReady = true;
		cross_memo.targetVecotor = this;
	}
	function crossDisable() {
		cross_memo.isCrossReady = false;
		cross_memo.targetVecotor = new Object();
	}
	function crossCompleted() {
		crossVector_group.children['transitionalCrossingVector'].remove();
	}
	function crossFail() {
		var lastGroupChildIndex = giveLastIndex();

		crossVector_group.children['transitionalCrossingVector'].remove();
		crossField_group.children[lastGroupChildIndex].remove();

		function giveLastIndex() {
			var lastIndex = crossField_group.children.length - 1;
			return lastIndex;
		}

	}
	function afterCrossCompleted() {
		vectorClear.call(this);
		vectorCrossingClosing();

		function vectorClear(){
			this.strokeColor = this.proto_strokeColor;
			this.name = 'normalVector';
		} 
		function vectorCrossingClosing() {
			mouse_action = "";
			cross_memo.isCrossReady = false;
			console.log("Closing!!");
		}
	}
};
Path.prototype.setCircleListener = function() {
	this.onMouseEnter = function(event) {
		this.fillColor = circle_style.hover_fillColor;
		mouseInCircle();
	}
	this.onMouseLeave = function(event) {
		this.fillColor = circle_style.fillColor;
		mouseOutCircle();
	}
	this.onMouseDown = function(event) {
		mouseInCircle();
	}
	this.onMouseUp = function(event) {
		judgement('vector_create_afterComplete') && afterVectorCompleted();
	}
	this.onMouseDrag = function(event) {
		judgement("vector_create", this) && vectorCreating.call(this, event);
	}
	this.onMouseMove = function(event) {
		mouseInCircle();
	}
	this.onClick = function(event) {
		mouseInCircle();
	}
	this.onDoubleClick = function(event) {
		mouseInCircle();
		judgement('form_call') && callForm(this);
	}
	function mouseInCircle(){
		mouse_where = "circle";
	}
	function mouseOutCircle() {
		mouse_where = "canvas";
	}
	function vectorCreating(event) {
		vectorCreatingInstruction();

		var startPoint = new Point(this.position.x, this.position.y),
			endPoint   = event.point;
		createVector(startPoint, endPoint);
		createAuxDashLine(startPoint, endPoint);

		function vectorCreatingInstruction() {
			mouse_action = "vector_create";
		}
	}
	function afterVectorCompleted() {
		auxline_disppear();
		vectorCreatingClosing();

		function auxline_disppear() {
			var lastAuxLineIndex = auxline_gruop.children.length - 1;
			var lastAuxLine = auxline_gruop.children[lastAuxLineIndex];

			Boolean(lastAuxLine) && (lastAuxLine.opacity = auxline_whetherDisplay ? auxDashLine_style.display_opacity : 0);
		}
		function vectorCreatingClosing() {
			 mouse_action = "";
		}
	}
	function callForm(thisCircle) {
		$.fancybox.open({
		    src  : '#circleForm',
		    type : 'inline',
		    opts : {
      			afterShow : function( instance, current ) {},
      			smallBtn: false
    		}
  		});

  		circleFormListenr();

		function circleFormListenr() {
			formOpen();
			argumentDisplay();

			function formOpen() {		
				$('#circleForm').mousemove(function(event){
					mouse_where = 'form';	
				});
				$('#DB').click(function(event){
					thisCircle.remove();
					formClose();
				});
				$('#SB').click(function(event) {
					savingData();
					formClose();
				});

				function formClose() {
					$('#DB').off('click');
					$('#SB').off('click');
					mouse_where = 'canvas';
				}
				function savingData(){
					thisCircle.data 			= new Object();
					thisCircle.data.isDenying   = $('label#denyBox.active')[0] ? true : false;
					thisCircle.data.title       = $('input.cir_title').val();
					thisCircle.data.description = $('textarea.cir_desc').val();
				}
			}
			function argumentDisplay() {
				thisCircle.data.isDenying ? $('label#denyBox').addClass("active")
										  : $('label#denyBox').removeClass("active");
				$('input.cir_title').val(thisCircle.data.title || "");
				$('textarea.cir_desc').val(thisCircle.data.description || "");
			}
		}
	}
};
Path.prototype.auxDashLineListener = function() {
	this.onMouseEnter = function(event) {
	    this.opacity = 1;
	}
	this.onMouseLeave = function(event) {
		this.opacity = auxline_whetherDisplay ? auxDashLine_style.display_opacity : 0;
	}
};

function createCrossField(startPoint, endPoint, mousePoint) {
	var cf_createData = {};

	cfDataSetting();
	drawCrossField(cf_createData);

	function cfDataSetting() {
		cf_createData = crossField_style;
		cf_createData.segments = giveCfSegments();

		function giveCfSegments() {
			var cfSegments = cross_memo.isCrossReady ? readyCfSegments() : failedCfSegments();

			return cfSegments;

			//       F/￣￣￣￣/K
			//       /       /
			//      /       /
			//     /       /
			//   G -------> C
			function readyCfSegments() {
				var targetStartPosition = Boolean(cross_memo.targetVecotor) && giveTargetStartPosition(cross_memo.targetVecotor),
					targetEndPosition   = Boolean(cross_memo.targetVecotor) && giveTargetEndPosition(cross_memo.targetVecotor);
				var targetStartPoint = new Point(targetStartPosition),
					targetEndPoint   = new Point(targetEndPosition);
				var baseStartPoint    = targetStartPoint,
					translateEndPoint = baseStartPoint + endPoint - startPoint,
					crossFiledPoint   = endPoint + targetEndPoint - startPoint,
					baseEndPoint      = targetEndPoint;	
				var segments = [baseStartPoint,//G
								translateEndPoint,//F
								crossFiledPoint,//K
								baseEndPoint];//C

				return segments;

				function giveTargetStartPosition(target) {
					var positionX = target.segments[0].point.x,
						positionY = target.segments[0].point.y;

					return [positionX, positionY];
				}
				function giveTargetEndPosition(target) {
					var lastIndex = target.segments.length - 1; 
					var positionX = target.segments[lastIndex].point.x,
						positionY = target.segments[lastIndex].point.y;

					return [positionX, positionY];
				}
			}
			function failedCfSegments() {
				var crossFiledPoint = endPoint + mousePoint - startPoint;
				var segments = [startPoint,//G
								endPoint,//F
								crossFiledPoint,//K
								mousePoint];//C
				return segments;
			}
		}
	}
	function drawCrossField(cf_createData) {
		var nowCrossField = new Path(cf_createData);
		nowCrossField.removeOnDrag();
		nowCrossField.setCrossFieldListener();

		crossField_group.addChild(nowCrossField);
	}
}
function createVector(startPoint, endPoint){
	if (navbar_whichVector === 'BV') {
		createBecauseVector();
	}else if(navbar_whichVector === 'LTV'){
		createLeadToVector();
	}else if(navbar_whichVector === 'NV'){
		createNotVector();
	}else if(navbar_whichVector === 'EIV'){
		createElseIfVector();
	}else{
		return undefined;
	}

	function restrictStrokeWidth() {
		var selfVector = endPoint - startPoint;
		var selfPathWidth = selfVector.length / 40,
			maxPathWidth = 10,
			minPathWidth = 4;
		if(selfPathWidth > maxPathWidth) {
			return maxPathWidth;
		}else if(selfPathWidth < minPathWidth){
			return minPathWidth;
		}else{
			return selfPathWidth;
		}
	}
	function drawVector(vector_createData) {
		var nowVector = new Path(vector_createData);
		nowVector.removeOnDrag();
		nowVector.setVectorListener();

		vector_group.addChild(nowVector);

		judgement('vector_cross_saveDraggingVector') && crossCondition();

		function crossCondition() {			
			nowVector.set(crossField_style);

			crossVector_group.addChild(nowVector);
		}
	}
	function createBecauseVector() {
		var bv_createData = {};

		bvDataSetting();
		drawVector(bv_createData);

		function bvDataSetting() {
			bv_createData = becVector_style;
			bv_createData.strokeWidth = restrictStrokeWidth();
			bv_createData.segments    = giveBecSegments();

			function giveBecSegments() {
				var becVector = endPoint - startPoint;
				var toRightArrVector = ((-becVector) * 0.1).clone(),
					toLeftArrVector  = ((-becVector) * 0.1).clone();
				toRightArrVector.angle += 30;		
				toLeftArrVector.angle -= 30;

				var arrRightPoint = endPoint + toRightArrVector,
					arrLeftPoint  = endPoint + toLeftArrVector;
				var segments = [startPoint,
								endPoint,
								arrRightPoint,
								endPoint,
								arrLeftPoint,
								endPoint];
				return segments;
			}
		}
	}
	function createLeadToVector() {
		var ltv_createData = {};

		ltvDataSetting();
		drawVector(ltv_createData);

		function ltvDataSetting() {
			ltv_createData = sinVector_style;
			ltv_createData.segments = giveSinPathSegments();

			function giveSinPathSegments() {
				var sinPathVector = endPoint - startPoint;
					height = 10,
					wavelength = 18,
					timeOfWave = sinPathVector.length / wavelength,
					radian_degree_rate = Math.PI / 360,
					unitOfSinX = 50,
					telescopeSinX = 20;

				return sinPathSegments();

				function sinPathSegments() {
					var segmentsArray = new Array();
					for (var sinX = 0; sinX < 360 * timeOfWave; sinX += unitOfSinX) {
						var radian = sinX * radian_degree_rate;//trun degree to radian
						var sinY = Math.sin(radian) * height;
						var sinPoint = new Point(sinX / telescopeSinX, sinY);
						sinPoint.angle += sinPathVector.angle;
						sinPoint += startPoint;
						segmentsArray.push(sinPoint);
					}
					return segmentsArray;
				}
			}
		}
	}
	function createNotVector() {
		var nv_createData = {};

		nvDataSetting();
		drawVector(nv_createData);

		function nvDataSetting() {
			nv_createData = notVector_style;
			nv_createData.strokeWidth = restrictStrokeWidth(startPoint, endPoint);
			nv_createData.segments    = giveNotSegments();

			function giveNotSegments() {
				var notVector = endPoint - startPoint,
					toRightAngleVector = notVector * 0.1,
					toLeftAngleVector  = notVector * 0.1;
				toRightAngleVector.angle += 45;
				toLeftAngleVector.angle  -= 45;

				var middlePoint 	 = (startPoint + endPoint) / 2,
					rightTopPoint    = middlePoint + toRightAngleVector,
					leftBottomPoint  = middlePoint - toRightAngleVector,
					leftTopPoint     = middlePoint + toLeftAngleVector,
					rightBottomPoint = middlePoint - toLeftAngleVector;
				var segments = [startPoint,
								middlePoint,
								rightTopPoint, 
								leftBottomPoint,
								middlePoint,
								leftTopPoint,
								rightBottomPoint,
								middlePoint,
								endPoint];
				return segments;
			}
		}
	}
	function createElseIfVector() {
		var eiv_createData = {};

		eiDataSetting();
		drawVector(eiv_createData);

		function eiDataSetting() {
			eiv_createData = eiVector_style;
			eiv_createData.segments = giveEISegments();

			function giveEISegments() {
				var segments = [startPoint, endPoint];
				return segments;
			}
		}
	}
}
function createAuxDashLine(startPoint, endPoint) {
	var auxDash_createData = {};

	adlDataSetting();
	drawAuxDashLine(auxDash_createData);

	function adlDataSetting() {
		auxDash_createData = auxDashLine_style;
		auxDash_createData.segments = giveAdlSegments();

		function giveAdlSegments() {
			var segments = new Array();
			var auxVector  = endPoint - startPoint,
				unitVector = auxVector / auxVector.length;
			for(var i = 0 ; i < 1500 ; i++){
				var dashX = startPoint.x + unitVector.x * i;
				var dashY = startPoint.y + unitVector.y * i;
				var dashPoint = new Point(dashX, dashY);
				segments.push(dashPoint);		
			}
			return segments;
		}
	}
	function drawAuxDashLine(auxDash_createData) {
		var nowAuxDashLine = new Path(auxDash_createData);
		nowAuxDashLine.removeOnDrag();
		nowAuxDashLine.auxDashLineListener();

		auxline_gruop.addChild(nowAuxDashLine);
	}
}