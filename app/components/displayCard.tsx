"use client"; // This component needs client-side features like useState and useEffect

import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import clsx from 'clsx';

type Props = {
    id: string;
    client_name?: string;
    deal_description?: string;
    deal_value?: number | string;
    last_activity_at?: string | null;
    lead_source?: string;
    time_in_stage?: string;
    stageTime?:(formattedDuration: string)=> void;
    onEdit?: (props: any) => void;
    onDelete?: (id: string) => void;
    [key: string]: any;
};

function DisplayCard(props: Props) {
    const { id, client_name, deal_description, deal_value, owner_name, last_activity_at, lead_source, time_in_stage, onEdit, onDelete } = props;


    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        data: {
            type: 'Lead',
            lead: props,
        },
    });

    const style: React.CSSProperties = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : undefined,
        height: "300px",
    };

    useEffect(() => {
        if (isDragging) {
            // store the currently dragged lead id
            sessionStorage.setItem("draggedLeadId", id);
        }
    }, [isDragging, id]);

    const editForm = () => {
        
        if (onEdit) onEdit(props);
    };

    const deleteForm = () => {
        if (onDelete) onDelete(id);
    };

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
            className="cardParent"
        >
            <div className="card">
                <h3>{client_name}</h3>
                <p>Deal Value: ${deal_value}</p>
                <p>{deal_description}</p>
                <p>Lead Source: {lead_source}</p>
                <div className="bottomSection">
                    <p>Last Contacted At: {last_activity_at ? new Date(last_activity_at).toDateString() : 'N/A'}</p>
                    <p>Time in Stage: {time_in_stage}</p>
                </div>
                <div className="icons">
                    <button className={clsx('edit')} onClick={editForm}>
                        <EditIcon style={{ color: 'blue' }} />
                    </button>
                    <button className={clsx('delete')} onClick={deleteForm}>
                        <DeleteIcon style={{ color: 'blue' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DisplayCard;

function stageTime(formattedDuration: string) {
    throw new Error('Function not implemented.');
}
