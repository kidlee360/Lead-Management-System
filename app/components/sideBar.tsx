"use client"; // This component needs client-side features like useState and useEffect

import TimerIcon from '@mui/icons-material/Timer';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {useState} from 'react';


export default function SideBar(props: any){
  const [active, setActive] = useState("");
  
  function timeInStage(){
    setActive(active === "time_in_stage"?"":"time_in_stage");
    props.sideBarClick(active)
  }

  function lastActivityAt(){
    setActive(active === "last_activity_at"?"":"last_activity_at");
    props.sideBarClick(active)
  }

  function dealValue(){
    setActive(active === "deal_value"?"":"deal_value");
    props.sideBarClick(active)
  }


    return(
    <div className={props.className}>
    <div className='flex flex-col items-center gap-[20px] mt-[20px]'>
        <button className='rounded-full bg-[#EAE0CF] h-[30px] w-[30px] hover:bg-blue-600 shadow-md' style={{backgroundColor: active === "time_in_stage"? "#1B3C53": ''}} onClick={timeInStage}>
          <TimerIcon style={{color: "white"}}/>
        </button>        
        <button className='rounded-full bg-[#EAE0CF] h-[30px] w-[30px] hover:bg-blue-600 shadow-md' style={{backgroundColor: active === "last_activity_at"? "#1B3C53": ''}} onClick={lastActivityAt}>
          <ConnectWithoutContactIcon style={{color: "white"}}/>
        </button>
        <button className='rounded-full bg-[#EAE0CF] h-[30px] w-[30px] hover:bg-blue-600 shadow-md' style={{backgroundColor: active === "deal_value"? "#1B3C53": ''}} onClick={dealValue}>
          <AttachMoneyIcon style={{color: "white"}} />
        </button>
    </div>
    </div>
    );
    
}