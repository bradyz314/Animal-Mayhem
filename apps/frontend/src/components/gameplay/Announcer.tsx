import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export default function Announcer() {
    const message = useSelector((state: RootState) => state.message.message);
    return (
        <p
                className='row-start-2 col-start-2 mx-auto text-center text-4xl text-teal-500'
            >
                {message}
            </p>
    )
}