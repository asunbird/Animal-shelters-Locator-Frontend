import { Link } from "react-router-dom";



function SignIn () {
    return (
        <section id="sign-in">

            <div>Sign in</div>
            <form id="sign-in-form" action="" method="">
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Submit</button>

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

            <div>
                <Link className="nav-sections" to="/">Home</Link>
            </div>


        </section>
    )
}

export default SignIn