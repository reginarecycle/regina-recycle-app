import "../../Learn.css"
import Navbar from "@/components/layout/Navbar"
import LeftBar from "@/components/LeftBar"
import SearchBar from "@/components/SearchBar"
import Main from "@/components/Main"
import LearnButton from "@/components/LearnButton"
import LearnFooter from "@/components/LearnFooter"

function Learn() {
  return (
    <div>
      <Navbar />
      <LeftBar />
      <SearchBar />
      <Main />
      <LearnButton />
      <LearnFooter />
    </div>
  )
}

export default Learn
