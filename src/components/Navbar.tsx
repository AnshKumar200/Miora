import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <Link to={"/"} className="flex gap-4 items-center w-fit px-2">
            <img src="logo.png" className="size-10" />
            <div className="font-gochi text-5xl text-white">Miora</div>
        </Link>
    )
}
