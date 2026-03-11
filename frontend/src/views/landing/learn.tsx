import "@/Learn.css"
import LeftBar from "@/components/learn/LeftBar"
import SearchBar from "@/components/learn/SearchBar"
import Main from "@/components/learn/Main"

function Learn() {
  return (
    <div className="min-h-screen flex">
      <LeftBar />
      <div className="flex-1 md:ml-[280px] lg:ml-[320px]">

        {/* <div className="pt-4 md:pt-6">
          <SearchBar />
        </div> */}
        {/* where the cards are imported */}
        <div>
          <Main />
        </div>

      </div>
    </div>
  )
}

export default Learn