
import { Link } from "react-router-dom";



function About () {
    
    return (
        <section id="about">

            <div>About us</div>
            <p>Welcome to Pet Map! <br />
                We are a community-driven platform dedicated to helping pet lovers find the perfect homes for their furry friends.
            </p>
            <div>
                <Link className="nav-sections" to="/">Home</Link>
            </div>
        </section>
    )
}

export default About