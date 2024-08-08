import NavBar from '../components/NavBar';
import '../styles/Home.css';
import MCA from '../components/MCA';

const Home = () => {
    return (
        <div className="home">
            <NavBar showRightLinks="true" />
            <MCA />
            <div className='user-info-section'>
          
            </div>
        </div>
    );
}

export default Home;
