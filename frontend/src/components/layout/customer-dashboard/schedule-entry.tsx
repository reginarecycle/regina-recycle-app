import { format } from 'date-fns';

type Material = 'Plastic' | 'Glass' | 'Cardboard' | 'Carton' | 'Paper' | '';

type Status = 'Approved' | 'Pending' | 'Not Started';

type props = {
    material1: Material;
    material2?: Material;
    material3?: Material;
    date: Date;
    status: Status;
};

export function ScheduleEntry({
    material1 = 'Plastic',
    material2 = '',
    material3 = '',
    date = new Date(),
    status = 'Not Started',

}: props
) {
    const formattedDate = format(date, 'dd MMM yyyy');

    return (
        <div className="schedule-row">
            <td className="material">{material1} {material2} {material3}</td>
            <td className="date">{formattedDate}</td>
            <td className="status">{status}</td>
            <td className="action">View</td>
        </div>
    )
}