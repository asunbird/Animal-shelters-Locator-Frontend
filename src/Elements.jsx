import { Link } from "react-router-dom";
import {useLocation} from "react-router-dom";
import { Outlet } from "react-router-dom";
// Outlet is for shouwing nested pages data. If we clicj Info or Address, the Outlet will display data from them.


export function About() {

    let currentLocation = useLocation();
    return (
        <section id="about">

            <div>About us</div>
            <p>Welcome to Pet Map! <br />
                We are a community-driven platform dedicated to helping pet lovers find the perfect homes for their furry friends.
            </p>
            <p>My Current URL Location is {currentLocation.pathname}</p><br/>
            <Link to="info">Information</Link><br/>
            <Link to="address">Address</Link><br/>
            <Outlet/>
            <div>
                <Link className="nav-sections" to="/">Home</Link>
            </div>
        </section>
    )
}

export function Contact() {
    let currentLocation = useLocation();
    return (
        <section id="contact">
            <div>Contact Support</div>
            <p>My Current URL Location is {currentLocation.pathname}</p><br/>
            <div>
                <Link className="nav-sections" to="/">Home</Link>
            </div>

        </section>
    )
}

export function Info() {
    return (
        <div>Information</div>
    )
}

export function Address() {
    return (
        <div>Address</div>
    )
}

const Elements =()=>{

}
export default Elements;