import { useEffect, useRef, useState } from "react";

export default function SnakeGame() {
  const CELL_SIZE = 20;
  const GRID_COLS = 20;
  const GRID_ROWS = 20;
  const INITIAL_SPEED = 8;

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTickRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);
  const dirRef = useRef({ x: 1, y: 0 });

  const [snake, setSnake] = useState(() => [
    { x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) }
  ]);
  const [food, setFood] = useState(() => randomFoodPosition([]));
  const [running, setRunning] = useState(true);

  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);

  function posEquals(a, b) { return a.x === b.x && a.y === b.y; }

  function randomFoodPosition(currentSnake) {
    const freeCells = [];
    for (let x = 0; x < GRID_COLS; x++) {
      for (let y = 0; y < GRID_ROWS; y++) {
        if (!currentSnake.some((s) => s.x === x && s.y === y)) freeCells.push({ x, y });
      }
    }
    return freeCells[Math.floor(Math.random() * freeCells.length)] || { x: 0, y: 0 };
  }

  function nextHeadPosition(direction, head) {
    return { x: head.x + direction.x, y: head.y + direction.y };
  }

  function moveTick() {
    if (!running) return;
    setSnake((prev) => {
      const head = prev[0];
      const newHead = nextHeadPosition(dirRef.current, head);
      if (
        newHead.x < 0 || newHead.x >= GRID_COLS ||
        newHead.y < 0 || newHead.y >= GRID_ROWS ||
        prev.some((seg) => posEquals(seg, newHead))
      ) {
        setRunning(false);
        return prev;
      }

      if (posEquals(newHead, foodRef.current)) {
        setFood(randomFoodPosition([newHead, ...prev]));
      }
      const newSnake = [newHead, ...prev];
      if (!posEquals(newHead, foodRef.current)) newSnake.pop();
      return newSnake;
    });
  }

  useEffect(() => {
    const handleKey = (e) => {
      const map = { ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}, w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0} };
      const newD = map[e.key];
      if (!newD) return;
      const cur = dirRef.current;
      if (newD.x === -cur.x && newD.y === -cur.y) return;
      dirRef.current = newD;
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const loop = (ts) => {
      if (!lastTickRef.current) lastTickRef.current = ts;
      if (running && ts - lastTickRef.current >= 1000 / speedRef.current) {
        lastTickRef.current = ts;
        moveTick();
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  function draw() {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = CELL_SIZE * GRID_COLS;
    const height = CELL_SIZE * GRID_ROWS;
    cvs.width = width * dpr;
    cvs.height = height * dpr;
    cvs.style.width = `${width}px`;
    cvs.style.height = `${height}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);

    ctx.fillStyle="#0f172a";
    ctx.fillRect(0,0,width,height);

    const f = foodRef.current;
    drawCell(ctx,f.x,f.y,CELL_SIZE,"#ef4444");

    const s = snakeRef.current;
    s.forEach((seg,i) => drawCell(ctx,seg.x,seg.y,CELL_SIZE,i===0?"#fbbf24":"#10b981"));
  }

  function drawCell(ctx,x,y,size,color){
    ctx.fillStyle=color;
    const pad=Math.max(1,Math.floor(size*0.08));
    ctx.fillRect(x*size+pad,y*size+pad,size-pad*2,size-pad*2);
  }

  function restart(){
    const start=[{x:Math.floor(GRID_COLS/2),y:Math.floor(GRID_ROWS/2)}];
    setSnake(start);
    snakeRef.current=start;
    dirRef.current={x:1,y:0};
    const nextFood=randomFoodPosition([]);
    setFood(nextFood);
    foodRef.current=nextFood;
    setRunning(true);
    speedRef.current=INITIAL_SPEED;
    lastTickRef.current=0;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
      <canvas ref={canvasRef} className="block touch-none select-none rounded-xl bg-slate-800 p-2" />
      <div className="flex gap-2">
        <button onClick={()=>setRunning(r=>!r)} className="px-3 py-2 rounded-lg bg-amber-400">{running?"Pause":"Play"}</button>
        <button onClick={restart} className="px-3 py-2 rounded-lg bg-emerald-500">Restart</button>
      </div>
    </div>
  );
}
