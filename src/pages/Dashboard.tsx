import { Grid } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import CollectionsChart from "../components/dashboard/CollectionsChart";
import ClientStatusChart from "../components/dashboard/ClientStatusChart";
import RecentPaymentsTable from "../components/dashboard/RecentPaymentsTable";
import { dailyCollectionsData, clientStatusData } from "../data/mockData";

const Dashboard = () => {
    return (
        <MainLayout title="Home">
            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Bar Chart */}
                <Grid item xs={12} md={8}>
                    <CollectionsChart data={dailyCollectionsData} />
                </Grid>

                {/* Pie Chart */}
                <Grid item xs={12} md={4}>
                    <ClientStatusChart data={clientStatusData} />
                </Grid>
            </Grid>

            <RecentPaymentsTable />
        </MainLayout>
    );
};

export default Dashboard;
