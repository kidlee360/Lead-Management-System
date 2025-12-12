"use client"; // This component needs client-side features like useState and useEffect

import { useState, useRef, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


import styles from './editCard.module.css';
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

    // (Removed stray object literal)
    const [eCard, setCard] = useState({
        id: props.id,
        client_name: props.client_name,
        deal_description: props.deal_description,
        deal_value: props.deal_value,
        last_activity_at: props.last_activity_at,
        lead_source: props.lead_source,
        columnName: props.columnName
    });


    // This effect syncs the local state with props, but ONLY when the card ID changes.
    // This prevents the form from resetting while the user is typing, which was happening
    // because the parent component re-renders every second to update the 'time_in_stage' value.
    useEffect(() => {
        setCard({
            id: props.id,
            client_name: props.client_name,
            deal_description: props.deal_description,
            deal_value: props.deal_value,
            last_activity_at: props.last_activity_at,
            lead_source: props.lead_source,
            columnName: props.columnName
        });
    }, [props.id]); // Only re-run this effect if the ID of the card changes.

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

    // (Removed duplicate/incorrect JSX and export)
    return (
        <div ref={cardRef} className={styles.cardParent} style={{ height: "300px" }}>
            <div className={styles.card}>
                <input className={styles.input}
                    type="text"
                    name="client_name"
                    value={eCard.client_name}
                    onChange={handleChange}
                    placeholder="Client Name"
                    style={{ background: "transparent" }}
                />

                <input className={styles.input}
                    type="number"
                    name="deal_value"
                    value={eCard.deal_value}
                    onChange={handleChange}
                    placeholder="How much is the deal worth"
                    style={{ background: "transparent" }}
                />

                <input className={styles.input}
                    type="text"
                    name="deal_description"
                    value={eCard.deal_description}
                    onChange={handleChange}
                    placeholder="Add a description"
                    style={{ background: "transparent" }}
                />
                <div className={styles.bottomSection}>
                    <input className={clsx(styles.input, styles.date)}
                        type="date"
                        name="last_activity_at"
                        onChange={handleChange}
                        value={eCard.last_activity_at}
                        placeholder="when was the last contact"
                    />
                    <input className={styles.input}
                        type="text"
                        name="lead_source"
                        onChange={handleChange}
                        value={eCard.lead_source}
                        placeholder="source of the lead"
                    />
                </div>
                <div className={styles.icons}>
                    <button className={clsx(styles.add)} onClick={submitForm}>
                        <AddIcon style={{ color: 'blue' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCard;