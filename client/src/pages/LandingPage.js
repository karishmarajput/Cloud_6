import NavbarCertif from "./components/Navbar";
import MainPage from "./homepage/MainPage";
import FeaturePage from "./homepage/FeaturePage";
import WorkingPage from "./homepage/WorkingPage";
import OurStoryPage from "./homepage/OurStoryPage";
import Footer from "./components/Footer";

function LandingPage() {
  return (
    <div style={{ backgroundColor: "#4e54c8" }}>
      <NavbarCertif textColor="#fff" />
      <MainPage />
      <FeaturePage />
      <WorkingPage />
      <OurStoryPage />
     
      <Footer />
    </div>
  );
}
export default LandingPage;
