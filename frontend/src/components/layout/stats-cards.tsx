import { Card } from "../ui/card";
import { CardHeader } from "../ui/card";
import { CardFooter } from "../ui/card";

type props = {
    title: string;
    data: number;
    unit: string;
}

export function StatsCards({
    title = "default",
    data = 0,
    unit = "units",
}:
    props) {
    return (
        <>
            <Card className="stats-card">
                <h1>{title}</h1>
                <h2>{data}
                    <p>{unit}</p></h2>
            </Card>
        </>
    )
}