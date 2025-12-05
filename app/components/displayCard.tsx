"use client"; // This component needs client-side features like useState and useEffect

import React, { useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
 import EditIcon from '@mui/icons-material/Edit';
 import DeleteIcon from '@mui/icons-material/Delete';

 import clsx from 'clsx';


function DisplayCard(props: any) {
    const { id, client_name, deal_description, deal_value, owner_name, last_activity_at, lead_source, time_in_stage, onEdit, onDelete } = props;
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: id,
        data: {
            type: 'Task',
            task: props,
        }
    });
 
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 0,
        height: "300px"
    };



    useEffect(() => {
        if (isDragging) {
            sessionStorage.setItem("draggedTaskId", id);
            console.log(sessionStorage.setItem("draggedTaskId", id));
        }
    }, [isDragging, id]);

    function editForm() {
        onEdit(props);
    }
    
    function deleteForm() {
        onDelete(id);
    }



    
    return (
        <div 
            // 1. Assign the ref for DND Kit to track the DOM node
            ref={setNodeRef}
            // 2. Apply the dynamic style object calculated above
            style={style}
            // 3. Spread the listeners and attributes for drag functionality
            // Listeners handle mouse/touch events, attributes handle accessibility
            {...attributes}
            {...listeners}
             className='{styles.cardParent}'
        >
            <div className='{styles.card}'>
                <h3>{owner_name}</h3>
                <p>{client_name}</p>
                <p>Deal Value: ${deal_value}</p>
                <p>{deal_description}</p>
                <p>Lead Source: {lead_source}</p>
                <div className='{styles.bottomSection}'>
                    <p>Last Contacted At: {last_activity_at && new Date(last_activity_at).toDateString() || 'N/A'}</p>
                    <p>Time in Stage: {time_in_stage}</p>
                </div>
                <div className='{styles.icons}'>
                    <button className='{clsx(styles.edit,)}' onClick={editForm}>
                        <EditIcon style={{ color: 'white' }} />
                    </button>
                    <button className='{clsx(styles.delete,)}' onClick={deleteForm}>
                        <DeleteIcon style={{ color: 'white' }} />
                    </button>
                </div>
            </div>
        </div>
    );

}

export default DisplayCard;