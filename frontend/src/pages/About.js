import '../styles/About.css'; 
import NavBar from '../components/NavBar';
import AboutSection from '../components/AboutSection';
// import Footer from '../components/Footer'; // Adding a Footer component

const About = () => {
    return (
        <div className="about">
            <NavBar showRightLinks="true" />
            <AboutSection />
            {/* <Footer /> */}
        </div>
    );
}

export default About;