import { Paper, Typography } from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "../../data/mockData";
import { useFetchData } from "../../hooks/useQuery";
import { PieChartDTO } from "../../interfaces/Interfaces";

const ClientStatusChart = () => {
    const { data, isLoading, error } = useFetchData<[{ data: PieChartDTO[] }]>(
        "/clientsPieChart0",
        "clientsPieChart"
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const clients: PieChartDTO[] = (data?.[0]?.data as PieChartDTO[]) ?? [];

    const dataChar = clients.map((client) => ({
        name: client.dim0,
        value: Number(client.mea0),
    }));

    return (
        <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
                {"Estado de Clientes"}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={dataChar}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(1)}%`
                        }
                    >
                        {dataChar.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default ClientStatusChart;
