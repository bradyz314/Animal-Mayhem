import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAreaDimensions, setPlayerDimensions, updateBullets } from "../../features/DodgeSlice";
import { RootState, store } from "../../app/store";
import { Bullet } from "../../types";

const MIN_BORDER = -3;
const MOVE_SPEED = 8;

export default function DodgeArea() {
    // Player Movement Directions
    const [left, setLeft] = useState(false);
    const [right, setRight] = useState(false);
    const [up, setUp] = useState(false);
    const [down, setDown] = useState(false);
    // Player Position
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    // Refs
    const divRef : React.RefObject<HTMLDivElement> = useRef(null);
    const imgRef : React.RefObject<HTMLImageElement> = useRef(null);
    // Redux
    const bullets: Bullet[] = useSelector((state: RootState) => state.dodge.bullets);
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        if(divRef.current && imgRef.current) {
            dispatch(setAreaDimensions([divRef.current.offsetWidth, divRef.current.offsetHeight]));
            dispatch(setPlayerDimensions([imgRef.current.offsetWidth, imgRef.current.offsetHeight]));
            const state: RootState = store.getState();
            setX((state.dodge.areaDimensions[0] - state.dodge.playerDimensions[0]) / 2);
            setY((state.dodge.areaDimensions[1] - state.dodge.playerDimensions[1])/ 2);
        } 
    }, [setX, setY, dispatch]);
    useEffect(() => { // Add event listeners for the key presses
        const handleKey = (key: string, pressed: boolean) => {
            switch(key.toLowerCase()) {
                case 'a':
                    setLeft(pressed);
                    break;
                case 'd':
                    setRight(pressed);
                    break;
                case 'w':
                    setUp(pressed);
                    break;
                case 's':
                    setDown(pressed);
                    break;
            }
        }
        const handleKeyPress = (event: KeyboardEvent) => {
            event.preventDefault();
            handleKey(event.key, true);
        }
        const handleKeyRelease = (event: KeyboardEvent) => {
            event.preventDefault();
            handleKey(event.key, false);
        }
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('keyup', handleKeyRelease);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('keyup', handleKeyRelease);
        }
    });
    const updatePlayer = () => {
        let xSpeed = 0;
          let ySpeed = 0;
          if (left) xSpeed -= 1;
          if (right) xSpeed += 1;
          if (up) ySpeed -= 1;
          if (down) ySpeed += 1; 
          if (xSpeed != 0 && ySpeed != 0) {
            xSpeed /= Math.sqrt(2);
            ySpeed /= Math.sqrt(2);
          }
          const newX = x + MOVE_SPEED * xSpeed;
          const newY = y + MOVE_SPEED * ySpeed;
          const state: RootState = store.getState();
          if (newX >= MIN_BORDER && newX <= state.dodge.areaDimensions[0] - state.dodge.playerDimensions[0]) setX(newX);
          if (newY >= MIN_BORDER && newY <= state.dodge.areaDimensions[1] - state.dodge.playerDimensions[1]) setY(newY);
    }
    useEffect(() => {
        const intervalID = setInterval(() => {
          updatePlayer();
          dispatch(updateBullets([x, y]));
        }, 50);
        return () => clearInterval(intervalID)
    });
    return (
        <div
            ref={divRef}
            className='relative col-start-2 row-start-2 min-w-full min-h-full border-solid border-red-500 rounded-md border-4'
        >
            <img
                src='/player/heart.png'
                ref={imgRef}
                className='absolute w-6 h-5 self-center flex'
                style= {{
                    top: `${y}px`,
                    left: `${x}px`
                }}
            />
            {bullets.map((bullet: Bullet, idx: number) => (
                <img 
                    src={bullet.imgPath}
                    key={idx}
                    className='absolute'
                    style = {{
                        top: `${bullet.pos[1]}px`,
                        left: `${bullet.pos[0]}px`,
                        width: `${bullet.radius}px`,
                        height: `${bullet.radius}px`,
                        zIndex: idx,
                    }}
                />
            ))}
            
        </div>
    )
}