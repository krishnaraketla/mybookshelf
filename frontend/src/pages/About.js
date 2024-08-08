import '../styles/About.css'; 
import NavBar from '../components/NavBar';
import AboutSection from '../components/AboutSection';
const About = () => {
    return (
        <div className="about">
            <NavBar showRightLinks="true" />
            <AboutSection />
        </div>
    );
}

export default About;
