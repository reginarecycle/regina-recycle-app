import "@/Learn.css"
import LeftBar from "@/components/learn/LeftBar"
import Main from "@/components/learn/Main"
import LearnFooter from "@/components/layout/LearnFooter"

function Learn() {
  return (
    <div>
      <div className="min-h-screen flex flex-row">
        <LeftBar />

        <div className="
          flex-1
          md:pl-[200px] 
          lg:pl-[290px]   
        ">
          <div>
            <Main />
          </div>
        </div>
      </div>

      <LearnFooter />
    </div>
  )
}

export default Learn