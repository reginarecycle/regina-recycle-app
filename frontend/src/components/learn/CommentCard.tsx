import LightBulb from '@/assets/LightBulb.svg'
import { Star } from 'lucide-react'

function CommentCard() {
    return (
        <div className="Comment-Card">
            <h3 className="flex gap-0.5">
                <Star className="mt-0.5" size={12} fill="#A16207" />
                Tip of the day
            </h3>
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