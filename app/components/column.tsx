"use client"; // This component needs client-side features like useState and useEffect

import Card from './card';//one way of setting path
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import DisplayCard from './displayCard';
import EditCard from './editCard';//another way of setting path
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function Content(props: any) {
    const {
        columnName, 
        tasks, 
        addTask, 
        handleSaveChanges, 
        editingTaskId, 
        setEditingTaskId,
        barClicked, 
        deleteTask } = props;

        // Define a static map to translate priority strings to numbers
        const PRIORITY_ORDER: { [key: string]: number } = {
          'low': 1,
          'medium': 2,
          'high': 3,
        };

        // Filter the global task list to show only tasks belonging to this column
    let columnTasks = tasks.filter((task: any) => task.columnname === columnName);

    // Filter/sort based on sidebar button that was clicked.
    // Supported values: "time_in_stage", "last_activity_at", "deal_value"
    if (barClicked === "time_in_stage") {
        // Show tasks that have a time_in_stage value and sort descending (largest first)
        columnTasks = columnTasks
            .filter((t: any) => t.time_in_stage !== null && t.time_in_stage !== undefined && t.time_in_stage !== "")
            .sort((a: any, b: any) => Number(b.time_in_stage) - Number(a.time_in_stage));
    } else if (barClicked === "last_activity_at") {
        // Show tasks with a last_activity_at and sort most recent last
        columnTasks = columnTasks
            .filter((t: any) => t.last_activity_at)
            .sort((a: any, b: any) =>  new Date(a.last_activity_at).getTime() - new Date(b.last_activity_at).getTime());
    } else if (barClicked === "deal_value") {
        // Show tasks with a deal_value and sort descending (highest value first)
        columnTasks = columnTasks
            .filter((t: any) => t.deal_value !== null && t.deal_value !== undefined && t.deal_value !== "")
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

    const handleStartEditing = (taskData: any) => {
        setEditingTaskId(taskData.id);
    };

    const handleStopEditing = () => {
        setEditingTaskId(null);
    };

    const taskIds = React.useMemo(() => columnTasks.map((task: any) => task.id), [columnTasks]);
    
    return (
        <div className={props.className}
            ref={setNodeRef} // DND Kit Ref for the droppable area
        >
            <div className='{styles.content}'>
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {columnTasks.map((task: any) => (                    
                        editingTaskId === task.id?
                        <EditCard
                           key={task.id}
                           id={task.id}
                           client_name={task.client_name}
                           deal_description={task.deal_description}
                           deal_value={task.deal_value}
                           owner_name={task.owner_name}
                           last_activity_at={task.last_activity_at}
                           lead_source={task.lead_source}
                           time_in_stage={task.time_in_stage}
                           columnName={task.columnname}
                           onSave={handleSaveChanges}
                           onCancel={handleStopEditing}
                        />
                        :
                        <DisplayCard 
                           key={task.id}
                           id={task.id}
                           client_name={task.client_name}
                           deal_description={task.deal_description}
                           deal_value={task.deal_value}
                           owner_name={task.owner_name}
                           last_activity_at={task.last_activity_at}
                           lead_source={task.lead_source}
                           time_in_stage={task.time_in_stage}
                           columnName={task.columnname}
                           onEdit={handleStartEditing}
                           onDelete={deleteTask}
                           
                        />
                         
                       
                    ))}
                </SortableContext>
                <Card 
                  onAdd={addTask}
                  columnName={columnName}
                />
            </div>
        </div>
    );
} 