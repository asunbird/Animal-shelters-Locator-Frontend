import { Link } from "react-router-dom";
import logoIcon from '/src/assets/Logo-PetMap.svg'; // Import icons

function SignIn() {

    return (
        <section id="sign-in-container">
            <header>
                <div>
                    <Link className="home-btn" to="/">
                        <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                    </Link> 
                </div> 
            </header>
            <main className="white-container">
                <div>Sign in</div>
                <form id="sign-in-form" action="" method="">
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit" id="submit-btn" >
                        <Link to="/profilehome">Submit</Link>
                    </button>
                    <div>Don't Remember Your Password?</div>
                    <input type="email" placeholder="Email Address" />
                    <button type="button">Reset Password</button>
                </form>
                <div>Or Create an Account</div>
                <form id="create-account-form" action="" method="">
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Create</button>
                </form>
            </main>
        </section>
    )
}

export default SignIn;