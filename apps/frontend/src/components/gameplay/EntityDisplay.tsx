import InfoBar from "./InfoBar";

interface EntityDisplayProps {
    row: string,
    col: string,
    player: boolean,
    imgPath: string,
}

export default function EntityDisplay({ row, col, player, imgPath }: EntityDisplayProps) {
    return (
        <div
            className={`${row} ${col} justify-self-center`}
        >
            <InfoBar player={player} />
            <img
                src={imgPath}
                className='mx-auto'
            />
        </div>
    )
}