import { Link } from "react-router-dom";
import {useLocation} from "react-router-dom";
import logoIcon from '/src/assets/Logo-PetMap.svg'; // Import icons
import { Outlet } from "react-router-dom";
// Outlet is for shouwing nested pages data. If we clicj Info or Address, the Outlet will display data from them.


export function About() {

    let currentLocation = useLocation();
    return (
        <section id="about">
            <header>
                <div>
                    <Link className="home-btn" to="/">
                        <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                    </Link> 
                </div> 
            </header>
            <main className="white-container">
                <div>About us</div>
                <p>Welcome to Pet Map! <br />
                    We are a community-driven platform dedicated to helping pet lovers find the perfect homes for their furry friends.
                </p>
                <p>My Current URL Location is {currentLocation.pathname}</p><br/>
                <Link to="info">Information</Link><br/>
                <Link to="contact">Contact</Link><br/>
                <Outlet/>
            </main>
        </section>
    )
}


export function Info() {
    return (
        <div>Information</div>
    )
}

export function Contact() {
    return (
        <div>Contact</div>
    )
}

const Elements =()=>{

}
export default Elements;