import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PatientChart({ stats }) {

  const data = {
    labels: [
      "Active",
      "Critical",
      "Recovering",
      "Stable",
      "Under Treatment"
    ],
    datasets: [
      {
        label: "Patients",
        data: [
          stats.active,
          stats.critical,
          stats.recovering,
          stats.stable,
          stats.under_treatment
        ],
        backgroundColor: [
          "#10b981",
          "#ef4444",
          "#22c55e",
          "#3b82f6",
          "#f59e0b"
        ]
      }
    ]
  };

  return (
    <div
      className="glass-card chart-card"
      style={{
        maxWidth: "350px",
        margin: "40px auto"
      }}
    >
      <h3 style={{ textAlign: "center" }}>
        Patient Status Distribution
      </h3>

      <Pie data={data} />
    </div>
  );
}

export default PatientChart;