import "@/Learn.css"
// import Navbar from "@/components/layout/Navbar"
import LeftBar from "@/components/learn/LeftBar"
import SearchBar from "@/components/learn/SearchBar"
import Main from "@/components/learn/Main"
import LearnButton from "@/components/learn/LearnButton"
import LearnFooter from "@/components/learn/LearnFooter"

function Learn() {
  return (
    <div>
      {/* <Navbar /> */}
      <LeftBar />
      <SearchBar />
      <Main />
      <LearnButton />
      <LearnFooter />
    </div>
  )
}

export default Learn
