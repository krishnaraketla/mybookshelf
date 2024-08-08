import NavBar from '../components/NavBar';
import '../styles/Home.css';
import MCA from '../components/MCA';

const Home = () => {
    return (
        <div className="home">
            <NavBar showRightLinks="true" />
            <MCA />
        </div>
    );
}

export default Home;
