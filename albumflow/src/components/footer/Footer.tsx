import {Link} from "@nextui-org/react";
import "./style.css";

function Footer(){
    return(
        <div className = "footer-container">
            <div className="footer-content">
                <div className="credits">
                    <h1>Archie Calvert</h1>
                </div>
                <div className="links">
                    <Link href="https://github.com/archiecalvert">GitHub</Link>
                    <Link href="https://linkedin.com/in/archiecalvert">LinkedIn</Link>
                </div>
            </div>
        </div>
    );
}
export default Footer