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
    <div className='flex flex-col items-center gap-[20px] mt-[20px]'>
        <button className='rounded-full bg-[#EAE0CF] h-[30px] w-[30px] hover:bg-blue-600 shadow-md' style={{backgroundColor: active === "time_in_stage"? "#1B3C53": ''}} onClick={highPriority}>
          <PriorityHighIcon style={{color: "white"}}/>
        </button>        
        <button className='rounded-full bg-[#EAE0CF] h-[30px] w-[30px] hover:bg-blue-600 shadow-md' style={{backgroundColor: active === "last_activity_at"? "#1B3C53": ''}} onClick={lowPriority}>
          <LowPriorityIcon style={{color: "white"}}/>
        </button>
        <button className='rounded-full bg-[#EAE0CF] h-[30px] w-[30px] hover:bg-blue-600 shadow-md' style={{backgroundColor: active === "deal_value"? "#1B3C53": ''}} onClick={dueDate}>
          <PendingActionsIcon style={{color: "white"}} />
        </button>
    </div>
    </div>
    );
    
}