"use client"; // This component needs client-side features like useState and useEffect

import { useState, useRef, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import clsx from 'clsx';


function EditCard(props: any) {
    const cardRef = useRef<HTMLDivElement>(null);

    function cancelEdit() {
        props.onCancel();
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                cancelEdit();
            }
        }

        //don't quite understand why the event listener below was added and 
        //then removed but it seems like a crucial logic to prevent errors
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cardRef]);

    const [eCard, setCard] = useState({
        id: props.id,
        client_name: props.client_name,
        deal_description: props.deal_description,
        owner_name: props.owner_name,
        deal_value: props.deal_value,
        last_activity_at: props.last_activity_at,
        lead_source: props.lead_source,
        time_in_stage: props.time_in_stage,
        columnName: props.columnName
    });


    // 💡 CRITICAL FIX: Sync local state when props change
    // This runs when the task ID changes (e.g., if you switch to edit a different task)
    // and ensures the form is always initialized with the correct, fresh data.
    useEffect(() => {
        setCard({
            id: props.id,
            client_name: props.client_name,
            deal_description: props.deal_description,
            owner_name: props.owner_name,
            deal_value: props.deal_value,
            last_activity_at: props.last_activity_at,
            lead_source: props.lead_source,
            time_in_stage: props.time_in_stage,
            columnName: props.columnName
        });
    }, [props.id, props.client_name, props.deal_description, props.deal_value, props.owner_name, props.last_activity_at, props.lead_source, props.time_in_stage, props.columnName]); 
    // Added all data props to the dependency array to ensure the form updates if the 
    // parent component happens to send new data without changing the ID (less common, but safe).

    function submitForm() {
        props.onSave(eCard);
        cancelEdit();
    }


    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;

        setCard((prevCard) => {
            const newCard = {
                ...prevCard,
                [name]: value
            };
            console.log(newCard);
            return newCard;
        });
    }

    return (
            <div ref={cardRef} className='{styles.cardParent}' style={{height: "300px" }}>
                <div className='{styles.card}'>
                    <h3>{eCard.owner_name}</h3>
                    <input className='{styles.input}'
                      type="text"
                      name="client_name"
                      value={eCard.client_name}
                      onChange={handleChange}
                        placeholder="Client Name"
                        style={{background: "transparent"}}
                    />

                   <input className='{styles.input}'
                      type="number"
                      name="deal_value"
                      value={eCard.deal_value}
                      onChange={handleChange}
                      placeholder="How much is the deal worth"
                      style={{background: "transparent"}}
                   />

                   <input className='{styles.input}'
                    type="text"
                     name="deal_description"
                       value={eCard.deal_description}
                       onChange={handleChange}
                     placeholder="Add a description"
                     style={{ background: "transparent"}}
                     />
                     <div className='{styles.bottomSection}' >

                    <input className='{clsx(styles.input, styles.date)} ' 
                        type="date"
                        name="last_activity_at"  
                        onChange={handleChange}
                        value={eCard.last_activity_at}
                        placeholder="when was the last contact" 
                    />
                    <input className='{styles.input}' 
                        type="text"
                        name="lead_source"  
                        onChange={handleChange}
                        value={eCard.lead_source}
                        placeholder="source of the lead" 
                    />
                    <h3>{eCard.time_in_stage}</h3>
                    </div>



                    <div className='{`${styles.icons}`}'>
                          <button className='{clsx(styles.add)}' onClick={submitForm}>
                              <AddIcon style={{ color: 'white' }} />
                          </button>
                    </div>    
                </div>
            </div>
    );
};

export default EditCard;