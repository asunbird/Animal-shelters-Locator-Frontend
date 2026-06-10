import { Link } from "react-router-dom";
import homeIcon from '/src/assets/icons/Home-icon.svg';

function FavoritesList() {

    return (
        <section id="favorites-list-container">
            <h2 className="jost-700">Favorites List</h2>
            
            <div className="fav-list-card">Contacts card</div>
            <div className="fav-list-card">Contacts card</div>
            <div className="fav-list-card">Contacts card</div>
           
            <div>
                <Link className="home-btn" to="/">
                    <img className="icon" src={homeIcon} alt="Home" />
                    <p className="nav-sections">Home</p>
                </Link>
            </div>
        </section>
    )
}

export default FavoritesList;