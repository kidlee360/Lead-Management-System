"use client"; // This component needs client-side features like useState and useEffect

import styles from '@/public/home.module.css';
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCorners, DragOverlay } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SideBar from './components/sideBar';
import Content from './components/column';
import DisplayCard from './components/displayCard';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth'; // <-- Import the hook

export default function App() {
interface Lead {
        id: number;
        client_name: string;
        deal_description: string;
        deal_value: string;
        last_activity_at: Date;
        lead_source: string;
        column_entry_time: Date;
        columnName: string;
        column_name: string;
    }

    // Remove React.useMemo and call the hooks directly at the top level of the component
    const pointerSensor = useSensor(PointerSensor, {
        // Require the pointer to move by 10 pixels before activating
        activationConstraint: {
            distance: 10,
        },
    });

    const keyboardSensor = useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    });
    
    const sensors = useSensors(pointerSensor, keyboardSensor);

    const [leads, setLeads] = useState<Lead[]>([]);
    const [refetchToggle, setRefetchToggle] = useState(false);
    const [activeLead, setActiveLead] = useState<Lead  | null>(null);
        //const [activeLead, setActiveLead] = useState<
      //  Omit<Lead, 'columnName'> & { column_name: string } | null
    //>(null);
    const [editingLeadId, setEditingLeadId] = useState(null);
    const [barClicked, setBarClicked] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, isLoading, logout, role } = useAuth();
    const router = useRouter();

    //--GET ROUTE--//
    const fetchLeads = async() => {      
        try {
            const response = await axios.get('/api/leads');
            setLeads(response.data);
        } catch (err: any) {
            setError("Failed to fetch leads. Please check if the API is running and your token is valid.");
            console.error("Dashboard data fetch error:", err.response ? err.response.data : err.message);
        }  finally {
        setLoading(false);
      }
    };

//----------------------------------------------------------
    // This effect will run whenever the 'leads' state changes.
    useEffect(() => {
        // Now, this will log the updated state after the re-render.
                    console.log("Fetched leads:", leads[2]);// Log the first lead for verification
    }, [leads]);
    //-----------------------------------------------------------

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
            // User is NOT logged in, redirect them immediately
            router.push('/auth/signup');
            return;
        }
    if (!isLoading && role === 'admin') {
            // User is an admin, redirect to admin dashboard
            router.push('/api/users/admin/dashboard');
            return;
        }
    // IMPORTANT: In a production app, the token should be managed securely
    // (e.g., stored in HTTP-only cookies, or local storage with careful consideration).
    // For local development, paste a valid token you get from /api/auth/login.
    const storedAuthData = localStorage.getItem('authData');

    // Safely parse the stored auth JSON. `localStorage.getItem` can return null,
    // so only call JSON.parse when we actually have a string. This avoids the
    // TypeScript error: Argument of type 'string | null' is not assignable to
    // parameter of type 'string'. Also handle invalid JSON defensively.
    let token: string | undefined;
    if (storedAuthData) {
      try {
        const parsed = JSON.parse(storedAuthData) as { token?: string };
        token = parsed?.token;
      } catch (err) {
        console.error('Failed to parse authData from localStorage', err);
      }
    }

    // If there's no token, redirect to signup/login (or handle unauthenticated state).
    if (!token) {
      // If the page should not render without a token, redirect early.
      router.push('/auth/signup');
      setLoading(false);
      return;
    }

    fetchLeads();
  }, [isAuthenticated, isLoading, role, router]); // Empty dependency array means this runs once after initial render

  
  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Lead Management System...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;






//--POST ROUTE--//
    //the task with the type: "any" is coming from the Card component when the form is submitted where it was changed from props.onAdd(card);
    const addLead = async (leads: any) => {
        const columnname = leads.columnName || 'In Progress'; // Default column for new tasks
        const addLeadData = { client_name: leads.client_name, deal_description: leads.deal_description, deal_value: leads.deal_value, columnName: columnname, owner_name: leads.owner_name, last_activity_at: leads.last_activity_at, lead_source: leads.lead_source, time_in_stage: leads.time_in_stage, id: leads.id };
        try {
            const response = await axios.post('/api/leads', addLeadData);
            setLeads((prevLeads) => [...prevLeads, response.data]);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    
    // This function will be called when the user clicks the "Edit" button
    const handleStartEditing = (dCard: any) => { //the dCard is sent over from the displayCard. it can be named anyhting eg task. Just decided to name it dCard for easier understanding
      setEditingLeadId(dCard.id); //whatever you name it above influences it eg task above would be = task.id
    };
    
    // This function will be called to exit edit mode (e.g., on cancel or save)
    const handleStopEditing = () => {
      setEditingLeadId(null);
    };

//--EDIT ROUTE--// 
    // You'll also need a function to handle the actual save logic
    const handleSaveChanges = async (eCard: any) => { // you can name it anything like props, hello etc. Just decided to leave it as eCard for easier understanding
        // ... logic to update the task in your main 'tasks' array
        const updateLeadData = { //   MAKE SURE THE FUNCTION USES {} AND NOT [] IF NOT IT WOULDNT WORK AND YOU WOULDNT EVEN KNOW WHY
            client_name: eCard.client_name, 
            deal_description: eCard.deal_description, 
            deal_value: eCard.deal_value, 
            column_name: eCard.columnName || 'In Progress', // The columnname you are using in the query
            id: eCard.id, // CRUCIAL for the WHERE clause
            last_activity_at: eCard.last_activity_at,
            lead_source: eCard.lead_source
        };
        try{
            console.log(updateLeadData);
            await axios.put('/api/leads', updateLeadData);
            fetchLeads();
        } catch (error) {
            console.error('Error updating lead:', error);
        }
          
        handleStopEditing(); // Exit edit mode after saving
    };

//--DELETE ROUTE--//
    const deleteLead = async (leadId: number) => {
        try {
            // 1. Send the DELETE request
            // Axios sends the object { id: taskId } in the request body
            await axios.delete('/api/leads', { data: { id: leadId } }); 
            
            // Note on Axios: For DELETE requests, the body must be passed via the 'data' property
            
            // 2. Update the state by removing the task (optimistic update)
            // Alternatively, you could call await fetchTasks(); again (safe, but slower)
            setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    
        } catch (error) {
            console.error('Error deleting lead:', error);
            // Add logic here to re-fetch if the delete failed, or show an error message
        } 
    };

//--LOGIC FOR MOVING TASKS--//
    const moveLead = async (leadId: number, newColumn: 'In Progress' | 'Closed Won' | 'Closed Lost') => {
        const leadToMove = leads.find(l => l.id === leadId);
        if (!leadToMove || leadToMove.columnName === newColumn) return; 
        // 1. Optimistic UI Update: Change columnname in local state immediately
        const updatedLead = { ...leadToMove, columnName: newColumn };
        
        setLeads(prevLeads =>
            prevLeads.map(lead =>
                lead.id === leadId ? updatedLead : lead
            )
        ); 
        // 2. API Call to update the database
        try {
            const payload = { id: leadId, columnName: newColumn };
            console.log('Attempting to move lead with payload:', payload);

            await axios.patch('/api/leads', payload);

            console.log('Lead move successful for lead ID:', leadId);
            fetchLeads();
        } catch (error: any) {
            console.error(`Error moving lead ${leadId} to ${newColumn}:`, error);
            // 3. Revert: If the API call fails, revert the UI state by fetching the correct data
            alert(`Failed to save card position. The card will be moved back.\n\nError: ${error.message}\n\nCheck the browser's developer console (F12) for more details.`);
            fetchLeads();
        }
    };    
    
    const columnProps = {
      leads,
      addLead,
      handleSaveChanges,
      editingLeadId,
      setEditingLeadId,
      deleteLead
    }

    const findContainer = (id: string | number) => {
        if (['In Progress', 'Closed Won', 'Closed Lost'].includes(id.toString())) {
            return id.toString();
        }
        const lead = leads.find(l => l.id === id);
        console.log("findContainer for ID:", id, "Lead:", lead, "ColumnName:", lead?.columnName);
        return lead?.column_name;
    };

    sensors

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const lead = leads.find(l => l.id === active.id);
        if (lead) {
            setActiveLead(lead);
        }
    };

    // In homeComponent.jsx
const handleDragOver = (event: DragOverEvent) => {
    // Only handling visual reordering if needed. 
    // Since you only care about column persistence, we can leave this simple.
    // DND Kit handles the visual effects automatically when using SortableContext/useSortable.
    // For pure column moves, we can often leave this empty or remove it.
    
    // For now, let's keep it minimal and let handleDragEnd handle the state/db update.
    const { active, over } = event;
    if (!over) return;

    const isOverAColumn = ['To Do', 'In Progress', 'Done'].includes(over.id.toString());
    const isOverALead = leads.some(l => l.id === over.id);

    // If the active item is a lead and the over item is not a lead, 
    // or if the active item is a lead and the over item is a lead in another column, 
    // DND-Kit will handle the visual transition into the new container. 
};

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveLead(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId !== overId) {
            const activeContainer = activeLead?.column_name; // its correct the naming is the error and I'm just too lazy to find and update all use cases
            const overContainer = findContainer(overId);

            if (!activeContainer || !overContainer) return;

            const activeIndex = leads.findIndex(l => l.id === activeId);
            const overIndex = leads.findIndex(l => l.id === overId);

            if (activeContainer === overContainer) {
                // Reordering within the same column
                if (activeIndex !== overIndex) {
                    setLeads(items => arrayMove(items, activeIndex, overIndex > -1 ? overIndex : items.length -1));
                }
            } else {
                // Moving to a different column
                moveLead(active.id as number, overContainer as 'In Progress' | 'Closed Won' | 'Closed Lost');
            }
        }
    };
    
    function barClick(active: string){
        setBarClicked(active);
        console.log(active);
    }


////======= SEND THE FORM TO THE REGISTER OR LOGIN FOR AUTHENTICATION AND VERIFICATION ======////


  const logOut = () => {
        // Call the logout function from the hook and redirect to signup/login
        logout();
        router.push('/auth/login');
  }





  return (
    <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd} 
        collisionDetection={closestCorners}
    >
        <div className='h-[50px] w-screen bg-[#1B3C53] flex items-center justify-end pr-[20px]'>
            <p onClick={logOut} className='text-white underline font-bold cursor-pointer hover:text-blue-500'>Logout</p>
        </div>
        <div className='bg-[#EAE0CF] pt-[40px]'>
        <div className={styles.check}>
            <SideBar className={styles.sidebar} sideBarClick={barClick}/>
            <Content
            {...columnProps}
            className={styles.content1}
            columnName = "In Progress"
            onMoveTask={moveLead}
            barClicked={barClicked}
            />
            <Content
            {...columnProps}
            className={styles.content2} 
            columnName = "Closed Won"
            onMoveTask={moveLead}
            barClicked={barClicked}
            />
            <Content
            {...columnProps}
            className={styles.content3}
            columnName = "Closed Lost"
            onMoveTask={moveLead}
            barClicked={barClicked}
            />

        </div>

        </div>
        <DragOverlay>
            {activeLead ? <DisplayCard id={String(activeLead.id)} lead={activeLead} onEdit={() => {}} onDelete={() => {}} /> : null}
        </DragOverlay>
    </DndContext>
  );

}
