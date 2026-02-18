import LightBulb from '../assets/LightBulb.svg'

function CommentCard() {
    return (
        <div className="Comment-Card">
            <h3>Tip of the day</h3>
            <h4>Pizza Boxes ?</h4>
            <img
                src={LightBulb}
                alt="Tip icon"
                className="
          absolute top-0 right-0  
          object-contain 
          opacity-100
          drop-shadow-sm
        "
            />
            <p>Greasy pizza boxes belong in the compost, not recycling! Only the clean lid can be recycled.</p>
        </div >
    )
}

export default CommentCard