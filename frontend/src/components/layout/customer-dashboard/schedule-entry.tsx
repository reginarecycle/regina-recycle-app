import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type Material = 'Plastic' | 'Glass' | 'Cardboard' | 'Carton' | 'Paper';

type Status = 'Approved' | 'Pending' | 'Not Started';

type ScheduleEntryProps = {
    material1: Material;
    material2?: Material;
    material3?: Material;
    date: Date;
    status: Status;
};

export function ScheduleEntry({
    material1 = 'Plastic',
    material2,
    material3,
    date = new Date(),
    status = 'Not Started',
}: ScheduleEntryProps) {
    const materials = [material1];
    if (material2) materials.push(material2);
    if (material3) materials.push(material3);

    const formattedDate = format(date, 'dd MMM yyyy');

    return (
        <div className="schedule-row">
            <td className="material gap-2.5 flex">
                {materials.map((material, idx) => (
                    <Badge key={idx} className="material-badge">
                        {material}
                    </Badge>
                ))}
            </td>
            <td className="date">{formattedDate}</td>
            <td className="status">
                <Badge
                    className={`status-badge font-medium ${status === 'Approved'
                        ? 'bg-[#4AD15F] hover:bg-green-600'
                        : status === 'Pending'
                            ? 'bg-[#FFB319] hover:bg-yellow-500'
                            : 'bg-red-600 hover:bg-red-600 text-white'
                        }`}
                >
                    {status}
                </Badge>
            </td>
            <td className="action">View</td>
        </div>
    );
}