import CommentCard from "./CommentCard"
function LeftBar() {
    return (
        <div className="
                w-full
                md:w-[280px]
                lg:w-[320px]
                md:fixed
                shrink-0
                p-6
                space-y-6
                h-auto md:h-screen
                z-10
                items-center
                ml-4
                mr-2
                ">

            <div className="left-bar">
                <h2 className="left-bar-h2">
                    What can be Recycled?
                </h2>

                <p className="left-bar-p">
                    Confused about what goes in the blue bin and what can be picked
                    up or dropped off? Browse our categories to sort smart.
                </p>
            </div>
            <CommentCard />

        </div>
    )
}

export default LeftBar