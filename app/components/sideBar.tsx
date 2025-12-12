"use client"; // This component needs client-side features like useState and useEffect

import LowPriorityIcon from '@mui/icons-material/LowPriority';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import {useState} from 'react';


export default function SideBar(props: any){
  const [active, setActive] = useState("");
  
  function highPriority(){
    setActive(active === "time_in_stage"?"":"time_in_stage");
    props.sideBarClick(active)
  }

  function lowPriority(){
    setActive(active === "last_activity_at"?"":"last_activity_at");
    props.sideBarClick(active)
  }

  function dueDate(){
    setActive(active === "deal_value"?"":"deal_value");
    props.sideBarClick(active)
  }


    return(
    <div className={props.className}>
    <div className='{styles.container}'>
        <button className='{styles.myButton}' style={{backgroundColor: active === "high"? "rgba(34, 30, 30, 0.2)": ''}} onClick={highPriority}>
          <PriorityHighIcon style={{color: "blue"}}/>
        </button>        
        <button className='{styles.myButton}' style={{backgroundColor: active === "low"? "rgba(34, 30, 30, 0.2)": ''}} onClick={lowPriority}>
          <LowPriorityIcon style={{color: "blue"}}/>
        </button>
        <button className='{styles.myButton}' style={{backgroundColor: active === "date"? "rgba(34, 30, 30, 0.2)": ''}} onClick={dueDate}>
          <PendingActionsIcon style={{color: "blue"}} />
        </button>
    </div>
    </div>
    );
    
}