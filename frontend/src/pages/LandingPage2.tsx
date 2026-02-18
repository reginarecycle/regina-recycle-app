// export default LandingPage
import '../LandingPage2.css';
import Navbar from "../components/Navbar"
import LeftBar from "../learn/LeftBar"
import SimpleFooter from "../learn/SimpleFooter.tsx"
import SearchBar from '../learn/SearchBar';
import Main from '../learn/Main.tsx'
import { LearnButton } from '../learn/LearnButton.tsx';

function LandingPage2() {
    return (
        <div>
            <Navbar />
            <LeftBar />
            <SearchBar />
            <Main />
            <LearnButton />
            <SimpleFooter />
        </div>
    )
}

export default LandingPage2