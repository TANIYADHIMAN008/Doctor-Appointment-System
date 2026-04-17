function Notifications({stats}){

const alerts=[];

if(stats.critical>0){
alerts.push(`⚠️ ${stats.critical} critical patient(s) need attention`);
}

if(stats.under_treatment>0){
alerts.push(`💊 ${stats.under_treatment} patients under treatment`);
}

if(stats.recovering>0){
alerts.push(`✅ ${stats.recovering} patients recovering`);
}

return(

<div className="glass-card">

<h3>🔔 Doctor Notifications</h3>

{alerts.length===0 ? (

<p>No alerts</p>

):(

alerts.map((a,i)=>(
<p key={i}>{a}</p>
))

)}

</div>

);

}

export default Notifications;