import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function QueueStatus({ appointmentId }) {

  const [queue, setQueue] = useState(null);

  useEffect(() => {

    fetch(`${API_BASE_URL}/queue/${appointmentId}`)
      .then(res => res.json())
      .then(data => setQueue(data));

  }, [appointmentId]);

  if (!queue) return <p>Loading queue...</p>;

  return (

    <div style={{marginTop:"10px"}}>

      <p>
        <b>Patients Ahead :</b> {queue.patients_ahead}
      </p>

      <p>
        <b>Estimated Wait :</b> {queue.estimated_wait_minutes} minutes
      </p>

    </div>

  );
}

export default QueueStatus;