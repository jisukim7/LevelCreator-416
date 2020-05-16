// $(document).ready(function(){
var boundBox;
//var canvas = document.getElementById("grid_canvas");
//var divw = document.getElementById("canvasStorage").offsetWidth;
//var divh = document.getElementById("canvasStorage").offsetHeight;
var outerCanvisDiv = document.getElementById("testGirdy")
// var square;
var lineX = [];
var lineY = [];
var lineXN = [];
var lineYN = [];
var isoLines = [];
var isoPoints =[];
var gridCanvas;
var leftMostPt;
var isoMapX = {};
var isoMapY = {};
var isoMap = [];
var map;

function createMap() {
    var mapOrientation = document.getElementById("orientation").value;
    var projectName = document.getElementById("projectName").value;
    var mapWidth = Number(document.getElementById("mapWidth").value);
    var mapHeight = Number(document.getElementById("mapHeight").value);
    var tileWidth = Number(document.getElementById("tileWidth").value);
    var tileHeight = Number(document.getElementById("tileHeight").value);


    map = {
        name: projectName,
        id:"",
        orientation: mapOrientation,
        width: mapWidth,
        height: mapHeight,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        nextLayerid: 2,
        gidCnt: 1,
        canvas: null,
        layers: [
            {
                type: "tile",
                id: 1,
                name: "Tile Layer1",
                properties: [],
                visibility: true,
                locked: false,
                height: mapHeight,
                width: mapWidth,
                x: 0,
                y: 0,
            }
        ],
        tilesets: [
        ]
    };

    localStorage.setItem('map', JSON.stringify(map));
}


function drawGrids(){
    let map = JSON.parse(localStorage.getItem('map'));
    let orientation = map.orientation;
    let tileW = map.tileWidth;
    let tileH = map.tileHeight;
    gridCanvas = new fabric.Canvas('grid_canvas');
    console.log(JSON.stringify(gridCanvas.toJSON()));
    // gridCanvas._historyInit();
    gridCanvas.preserveObjectStacking = true;
    gridCanvas.setWidth(map.width * map.tileWidth);
    gridCanvas.setHeight(map.height * map.tileHeight);
    outerCanvisDiv.style.width=map.width * map.tileWidth +"px"
    outerCanvisDiv.style.height=map.height * map.tileHeight+"px"
    // console.log(gridCanvas);
    if (map.orientation === "Orthogonal"){
        boundBox = new fabric.Rect({
            width: map.width * map.tileWidth,
            height: map.height *map.tileHeight,
            fill: "transparent",
            stroke: "#c0c4c2",
            hasBorders: false,
            selectable: false,
            hasControl: false,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            excludeFromExport: true,
        });

        gridCanvas.add(boundBox);

        gridCanvas.centerObject(boundBox);


        //vertical lines
        for(let i = 0; i < map.width; i++){
            let l = boundBox.left + ((map.tileWidth) * i);
            let t = boundBox.top;
            let b = boundBox.top + boundBox.height;

            lineY.push(new fabric.Line([l,t,l, b],{
                stroke: "#c0c4c2",
                hasBorders: false,
                selectable: false,
                hasControl: false,
                lockMovementX: true,
                lockMovementY: true,
                excludeFromExport: true,
            }));

            lineXN.push(l);//all left value
        }

        //add horizontal lines to canvas
        lineY.forEach((line)=>{
            gridCanvas.add(line);
        });

        //horizontal lines
        for(let i = 0; i < map.height; i++){
            let t = boundBox.top + ((map.tileHeight) * i);
            let l = boundBox.left;
            let r = boundBox.left + boundBox.width;

            lineX.push(new fabric.Line([l,t,r,t],{
                stroke: "#c0c4c2",
                hasBorders: false,
                selectable: false,
                hasControl: false,
                lockMovementX: true,
                lockMovementY: true,
                excludeFromExport: true,
            }));

            lineYN.push(t);//all top value
        }

//add horizontal lines to canvas
        lineX.forEach((line)=>{
            gridCanvas.add(line);
        });

    }else if(map.orientation === "Isometric"){
        boundBox = new fabric.Rect({
            width: map.width * map.tileWidth,
            height: map.height *map.tileHeight,
            stroke: "#c0c4c2",
            fill: 'transparent',
            hasBorders: false,
            selectable: false,
            hasControl: false,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            excludeFromExport: true,
        });

        gridCanvas.add(boundBox);
        gridCanvas.centerObject(boundBox);

        for(i = 0; i < map.width; i++){
            for(j = 0; j < map.height; j++){
                var init_xPos = boundBox.left + (boundBox.width/2) + map.tileWidth/2;
                var init_yPos = boundBox.top;
                var x = (i - j) * map.tileWidth / 2 + init_xPos;
                var y = (i + j) * map.tileHeight / 2 + init_yPos;

                var left =  x - map.tileWidth/2;
                var top =  y;

                let lefttop = new fabric.Line([left,top, x - map.tileWidth, y + map.tileHeight/2],{
                    stroke: "#c0c4c2",
                    hasBorders: false,
                    selectable: false,
                    hasControl: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    excludeFromExport: true,
                });


                let leftbottom = new fabric.Line([x - map.tileWidth,y + map.tileHeight/2, x - map.tileWidth/2, y + map.tileHeight],{
                    stroke: "#c0c4c2",
                    hasBorders: false,
                    selectable: false,
                    hasControl: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    excludeFromExport: true,
                });


                let rightbottom = new fabric.Line([x - map.tileWidth/2,y + map.tileHeight, x, y + map.tileHeight/2],{
                    stroke: "#c0c4c2",
                    hasBorders: false,
                    selectable: false,
                    hasControl: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    excludeFromExport: true,
                });


                let righttop = new fabric.Line([x, y + map.tileHeight/2, x - map.tileWidth/2, y ],{
                    stroke: "#c0c4c2",
                    hasBorders: false,
                    selectable: false,
                    hasControl: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    excludeFromExport: true,
                });


                let d = new fabric.Point(x - map.tileWidth/2, y);//top vertex
                let e = new fabric.Point(x - map.tileWidth, y + map.tileHeight/2);

                isoLines.push(lefttop);
                isoLines.push(leftbottom);
                isoLines.push(rightbottom);
                isoLines.push(righttop);

                isoPoints.push(d);
                checkDupPush(isoMap,d);
                checkDupPush(isoMap,e);

            }
        }

        isoLines.forEach((line) => {
            gridCanvas.add(line);
        });

        leftMostPt = new fabric.Point(boundBox.left, boundBox.top + boundBox.height/2);
        isoPoints.push(leftMostPt);//most left point

        isoMap.forEach(point => {
            if(!(point.x in isoMapX)){
                isoMapX[point.x] = [];
                isoMapX[point.x].push(point.y);
            }else{
                isoMapX[point.x].push(point.y);
            }
        });
        isoMap.forEach(point => {
            if(!(point.y in isoMapY)){
                isoMapY[point.y] = [];
                isoMapY[point.y].push(point.x);
            }else{
                isoMapY[point.y].push(point.x);
            }
        });
    }

}

function checkDupPush(arr, newItem){
    let isDuplicated = false;
    arr.forEach(function (element) {
        if (element.eq(newItem)) {
            isDuplicated = true;
        }
    });
    if(!isDuplicated){
        arr.push(newItem)
    }
}


function loadContent(theId, mapJSON){
    window.location = "/workspace";
    let id = parseInt(theId);
    let theMapJSON = JSON.parse(mapJSON);
    theMapJSON.id = id;
    localStorage.setItem('map',JSON.stringify(theMapJSON));
}

// function removeLargest(numbers) {
//     const largest = Math.max.apply(null, numbers);
//     const pos = numbers.indexOf(largest);
//     return numbers.slice(0, pos).concat(numbers.slice(pos + 1));
// }

/////////////// zoom and panning function start from here //////////////////////
var zoomhandler = function(event) {
    if (event.e.ctrlKey) {

        var delta = event.e.deltaY;
        var zoom = gridCanvas.getZoom();

        //greater the divisor the smoother zoom based on mousescroll is
        zoom = zoom - delta / 200;

        //zooms in up to 10 times(1000%)
        if (zoom > 10) zoom = 10;
        //zooms out up to 10%
        if (zoom < 0.10) zoom = 0.10;
        gridCanvas.zoomToPoint({x: event.e.offsetX, y: event.e.offsetY}, zoom);
        event.e.preventDefault();
        event.e.stopPropagation();
        var vpt = gridCanvas.viewportTransform;
        //if zoom is less than 500%
        if (zoom < 5) {
            //keep the grid in the center of the canvas
            gridCanvas.viewportTransform[4] =  (gridCanvas.width/2) - gridCanvas.width * zoom / 2;
            gridCanvas.viewportTransform[5] = (gridCanvas.height/2) - gridCanvas.height * zoom / 2;
        } else {
            //panning left and right
            if (vpt[4] >= 0) {
                //going left
                gridCanvas.viewportTransform[4] = 0;
            } else if (vpt[4] < gridCanvas.width - gridCanvas.width * zoom) {
                gridCanvas.viewportTransform[4] = gridCanvas.width - (gridCanvas.width * zoom);
            }
            //panning up and down
            if (vpt[5] >= 0) {
                //going up
                gridCanvas.viewportTransform[5] = 0;
            } else if (vpt[5] < gridCanvas.height - gridCanvas.height * zoom) {
                gridCanvas.viewportTransform[5] = gridCanvas.height - (gridCanvas.height * zoom);
            }

        }
    }
};


function loadMap(){
    let map = JSON.parse(localStorage.getItem("map"));
    gridCanvas.loadFromJSON(map.canvas, ()=>{
        gridCanvas.add(boundBox);
        if(map.orientation === "Orthogonal"){
            lineX.forEach((line)=>{
                gridCanvas.add(line);
                gridCanvas.sendToBack(line);
            });
            lineY.forEach((line)=>{
                gridCanvas.add(line);
                gridCanvas.sendToBack(line);
            });
        }else if(map.orientation === "Isometric"){
            isoLines.forEach((line)=>{
                gridCanvas.add(line);
                gridCanvas.sendToBack(line);
            });
        }
        gridCanvas.renderAll();
    });
    // gridCanvas.loadFromJSON(map.canvas, gridCanvas.renderAll.bind(gridCanvas), function(o, object) {
    //     fabric.log(o, object);
    // });
    gridCanvas.getObjects().forEach(obj=>{
        console.log(obj);
    });
}

drawGrids();
loadMap();
gridCanvas.on('mouse:wheel', zoomhandler);

gridCanvas.on('mouse:down', function(event) {
    event.e.stopPropagation();
    if (event.e.altKey) {
        var evt = event.e;
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    }
});

gridCanvas.on('mouse:move', function(event) {
    if (this.isDragging) {
        var evt = event.e;
        this.viewportTransform[4] += evt.clientX - this.lastPosX;
        this.viewportTransform[5] += evt.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    }
});
gridCanvas.on('mouse:up', function(event) {
    this.isDragging = false;
    this.selection = true;
});

function reloadTest(){
    console.log("reload test........");
    var json = '{"objects":[{"type":"rect","originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"#29477F","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(94, 128, 191, 0.5)","blur":5,"offsetX":10,"offsetY":10},"visible":true,"clipTo":null,"rx":0,"ry":0,"x":0,"y":0},{"type":"circle","originX":"center","originY":"center","left":300,"top":400,"width":200,"height":200,"fill":"rgb(166,111,213)","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"#5b238A","blur":20,"offsetX":-20,"offsetY":-10},"visible":true,"clipTo":null,"radius":100}],"background":""}'
    gridCanvas.loadFromJSON(json, gridCanvas.renderAll.bind(gridCanvas), function(o, object) {
        fabric.log(o, object);
    });
}

// document.getElementById("undoBtn").addEventListener("click", reloadTest);