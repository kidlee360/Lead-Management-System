"use client"; // This component needs client-side features like useState and useEffect

import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import clsx from 'clsx';
import styles from './card.module.css';

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
            className={clsx( 'flex rounded-lg w-[90%] bg-[#EAE0CF] text-center pb-[10px]')}
        >
            <div className={clsx(styles.card, 'flex flex-col gap-[5px]')}>
                <h3 className='font-bold rounded-lg border border-dashed border-[#547792]'>{client_name}</h3>
                <p className='rounded-lg border border-dashed border-[#547792]'><span className='font-bold'>Deal Value:</span> <span>${deal_value}</span></p>
                <div className='flex flex-col rounded-lg border border-dashed border-[#547792]'>
                    <p className='font-bold block'>Description:</p>
                    <p>{deal_description}</p>
                </div>
                <p className='rounded-lg border border-dashed border-[#547792]'> <span className='font-bold'>Lead Source:</span> <span>{lead_source}</span></p>
                    <p className='rounded-lg border border-dashed border-[#547792]'><span className='font-bold'>Last Contacted At:</span> <span>{last_activity_at ? new Date(last_activity_at).toDateString() : 'N/A'}</span></p>
                    <p className='rounded-lg border border-dashed border-[#547792]'><span className='font-bold'>Time in Stage:</span> <span>{time_in_stage || 'N/A'}</span></p>
                <div className="icons flex justify-between px-[10px] pt-[5px]">
                    <button className='rounded-full bg-blue-300 h-[30px] w-[30px] hover:bg-blue-600' onClick={editForm}>
                        <EditIcon style={{ color: 'white' }} />
                    </button>
                    <button className='rounded-full bg-blue-300 h-[30px] w-[30px] hover:bg-blue-600' onClick={deleteForm}>
                        <DeleteIcon style={{ color: 'white' }} />
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
