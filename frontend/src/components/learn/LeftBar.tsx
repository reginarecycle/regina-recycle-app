import CommentCard from "./CommentCard"
function LeftBar() {
    return (
        <section className="flex-col">
            <div className="Left-Bar">
                <div>
                    <h2>What can be Recycled?</h2>
                    <div>
                        <p>Confused about goes in the blue bin? and what can be picked up or dropped off. Browse our categories to sort smart.</p>
                    </div>
                </div>
                <CommentCard />
            </div>
        </section>
    )
}

export default LeftBar