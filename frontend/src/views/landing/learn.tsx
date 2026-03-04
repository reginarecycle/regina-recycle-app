import "@/Learn.css"
import LeftBar from "@/components/learn/LeftBar"
import SearchBar from "@/components/learn/SearchBar"
import Main from "@/components/learn/Main"
import LearnButton from "@/components/learn/LearnButton"

function Learn() {
  return (
    <div>
      <LeftBar />
      <SearchBar />
      <Main />
      <LearnButton />
    </div>
  )
}

export default Learn
