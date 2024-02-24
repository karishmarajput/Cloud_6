import DragDropFile from "./components/DragDropFile";
import NavbarCertif from "./components/Navbar";
import Footer from "./components/Footer";
function Verify() {
  return (
    <div>
      <div className="navLogin">
        <NavbarCertif  textColor="#FFFFFF" />
      </div>
      <DragDropFile />
      <Footer />
    </div>
  );
}
export default Verify;
