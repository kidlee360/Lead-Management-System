"use client"; // This component needs client-side features like useState and useEffect

import Card from './card';//one way of setting path
import React,{useEffect, useState} from 'react';
import { useDroppable } from '@dnd-kit/core';
import DisplayCard from './displayCard';
import EditCard from './editCard';//another way of setting path
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { intervalToDuration, formatDuration } from 'date-fns';

export default function Column(props: any) {
    const {
        columnName,
        leads,
        addLead,
        handleSaveChanges,
        editingLeadId,
        setEditingLeadId,
        barClicked,
        deleteLead
    } = props;

    const [endTime, setEndTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setEndTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const fullLeads = leads.map((lead: any) => {
        const columnEntryTime = lead.column_entry_time;
        // 1. Capture the start time
        const startTime: Date = new Date(columnEntryTime ? columnEntryTime : Date.now());
        const duration = intervalToDuration({ start: startTime, end: endTime });
        const formattedDuration: string = formatDuration(duration, {
            format: ['days', 'hours', 'minutes', 'seconds'],
            zero: true,
        });
        return { ...lead, time_in_stage: formattedDuration };
    });

    // Filter the global lead list to show only leads belonging to this column
    let columnLeads = fullLeads.filter((lead: any) => lead.column_name === columnName);

    // Filter/sort based on sidebar button that was clicked.
    // Supported values: "time_in_stage", "last_activity_at", "deal_value"
    if (barClicked === "time_in_stage") {
        // Show leads that have a time_in_stage value and sort descending (largest first)
        columnLeads = columnLeads
            .sort((a: any, b: any) => Number(b.time_in_stage) - Number(a.time_in_stage));
    } else if (barClicked === "last_activity_at") {
        // Show leads with a last_activity_at and sort most recent last
        columnLeads = columnLeads
            .filter((l: any) => l.last_activity_at)
            .sort((a: any, b: any) => new Date(a.last_activity_at).getTime() - new Date(b.last_activity_at).getTime());
    } else if (barClicked === "deal_value") {
        // Show leads with a deal_value and sort descending (highest value first)
        columnLeads = columnLeads
            .filter((l: any) => l.deal_value !== null && l.deal_value !== undefined && l.deal_value !== "")
            .sort((a: any, b: any) => Number(b.deal_value) - Number(a.deal_value));
    }

    // --- DND Kit useDroppable hook ---
    const { setNodeRef, isOver } = useDroppable({
        // CRITICAL: The ID DND Kit uses to identify the drop target
        id: columnName,
        data: {
            type: 'Column',
            name: columnName,
        }
    });

    const handleStartEditing = (leadData: any) => {
        setEditingLeadId(leadData.id);
    };

    const handleStopEditing = () => {
        setEditingLeadId(null);
    };

    const leadIds = React.useMemo(() => columnLeads.map((lead: any) => lead.id), [columnLeads]);

    return (
        <div className={props.className}
            ref={setNodeRef} // DND Kit Ref for the droppable area
        >
            <div className={'styles.content'}>
                <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
                    {columnLeads.map((lead: any) => (
                        editingLeadId === lead.id ?
                            <EditCard
                                key={lead.id}
                                id={lead.id}
                                client_name={lead.client_name}
                                deal_description={lead.deal_description}
                                deal_value={lead.deal_value}
                                owner_name={lead.owner_name}
                                last_activity_at={lead.last_activity_at}
                                lead_source={lead.lead_source}
                                time_in_stage={lead.time_in_stage}
                                columnName={lead.columnname}
                                onSave={handleSaveChanges}
                                onCancel={handleStopEditing}
                            />
                            :
                            <DisplayCard
                                key={lead.id}
                                id={lead.id}
                                client_name={lead.client_name}
                                deal_description={lead.deal_description}
                                deal_value={lead.deal_value}
                                owner_name={lead.owner_name}
                                last_activity_at={lead.last_activity_at}
                                lead_source={lead.lead_source}
                                time_in_stage={lead.time_in_stage}
                                columnName={lead.columnname}
                                onEdit={handleStartEditing}
                                onDelete={deleteLead}
                            />
                    ))}
                </SortableContext>
                <Card
                    onAdd={addLead}
                    columnName={columnName}
                />
            </div>
        </div>
    );
}