import { EntityData } from "../../types";
import InfoBar from "./InfoBar";

interface EntityDisplayProps {
    row: string,
    col: string,
    data: EntityData
}

export default function EntityDisplay({row, col, data} : EntityDisplayProps) {
    return (
        <div 
            className={`${row} ${col} justify-self-center`}
        >
            <InfoBar data={data} player={data.isPlayer}/>
            <img 
                src={data.imgPath}
                className='mx-auto'
            />
        </div>
    )
}