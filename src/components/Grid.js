import React, { useEffect, useRef, useState } from 'react'
import Quadtree, { Rectangle } from './Quadtree';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

export default function Grid() {
    const [gridSize, setGridSize] = useState({width: '1200', height: 800});
    const [totalPts, setTotalPts] = useState(200);
    const [pts, setPts] = useState(null);
    const [pos, setPos] = useState({x:null, y:null});
    const [window, setWindow] = useState(50);
    const ctx = useRef();
    const cv = useRef();
    const qt = useRef();

    useEffect(() => {
        
        cv.current = document.getElementById("my-canvas");
        cv.current.width = cv.current.offsetWidth;
        cv.current.height = cv.current.offsetHeight;
        ctx.current = cv.current.getContext("2d");
        qt.current = new Quadtree(new Rectangle(0, 0, gridSize.width, gridSize.height));
        cv.current.addEventListener("mousemove", function(e) { 
            var cRect = cv.current.getBoundingClientRect();
            var x = Math.round(e.clientX - cRect.left);
            var y = Math.round(e.clientY - cRect.top);
            setPos({x, y});
        });
        drawPoints()
    },[]);

    const drawPoints = () => {
        ctx.current.clearRect(0, 0, cv.current.width, cv.current.height);
        for(var i=0; i<=gridSize.height; i++) {
            ctx.current.beginPath();
            ctx.current.lineWidth = 1;
            ctx.current.strokeStyle = "#e9e9e9";
            ctx.current.moveTo(0, 25*i+0.5);
            ctx.current.lineTo(gridSize.width, 25*i+0.5)
            ctx.current.stroke();
        }
    
        for(var i=0; i<=gridSize.width; i++) {
            ctx.current.beginPath();
            ctx.current.lineWidth = 1;
            ctx.current.strokeStyle = "#e9e9e9";
            ctx.current.moveTo(25*i+0.5, 0);
            ctx.current.lineTo(25*i+0.5, gridSize.height)
            ctx.current.stroke();
        }

        if (pts){
            ctx.current.strokeStyle = "#e9e9e9";
            ctx.current.fillStyle = "black";
            for(var i=0; i<=pts.length; i++) {
                if (pts[i]){
                    ctx.current.fillRect(pts[i][0],pts[i][1], 2,2)
                }
            }
        }
    }

useEffect(() => {
    let g = [];
    qt.current = new Quadtree(new Rectangle(0, 0, gridSize.width, gridSize.height));
    ctx.current.clearRect(0, 0, cv.current.width, cv.current.height);
    for(var i=0; i<=totalPts; i++) {    
        const x = Math.ceil(Math.random()*gridSize.width);
        const y = Math.ceil(Math.random()*gridSize.height);
        g = [...g, [x,y]];
        qt.current.insert(x, y)
    }
    setPts(g);
}, [totalPts, gridSize]);


useEffect(() => {
    if (ctx.current && pos.x && pos.y && qt.current) {
        drawPoints();
        ctx.current.beginPath();
        ctx.current.rect(pos.x-window, pos.y-window, window*2, window*2)
        ctx.current.strokeStyle = "rgb(248, 63, 86)"
        ctx.current.stroke();
        let rg = new Rectangle(pos.x-window, pos.y-window, window*2, window*2);
        let k = [];
        qt.current.nearby(rg, k);
        k.forEach((pt) => {
            ctx.current.fillStyle = "red";
            ctx.current.fillRect(pt.x,pt.y, 2,2);
        })
    }
    
}, [pos, pts, window]);

  return (
    <div className='container-fluid' style={{"backgroundColor" : "white", "padding" : "20px"}} >
        <h3 style={{"textAlign" : "center"}}>Quadtree Visualization</h3>
        <div className='row'>
            <div className='col-lg-2 mb-3'>
                <div className='row mt-5'>
                    <label for={'sdsdfsd'}>Number of points : {totalPts} </label>
                <input id="sdsdfsd" type="range" min="200" max="40000" step="10" value={totalPts} onChange={(e) => setTotalPts(e.target.value)}/>
                <br></br><br></br>
                <label for={'sdsdfsd'}>Pointer window size : {window} </label>
                <input id="sdsdfsd" type="range" min="10" max="200" step="10" value={window} onChange={(e) => setWindow(e.target.value)}/>
                </div>
                <br></br>
            </div>
            <div className='col-lg-8' style={{"height" : "88vh"}}>
                {gridSize && <canvas id="my-canvas" style={{"backgroundColor" : "white", "border" : "4px solid black", "borderRadius" : "10px", "width" : "100%", "height" : "100%"}}></canvas>}
            </div>
        </div>
        
        
    </div>
  )
}