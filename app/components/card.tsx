"use client"; // This component needs client-side features like useState and useEffect

import { useState, useRef, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import clsx from 'clsx';


function Card(props: any) {
    const [isExpanded, setExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    function expand() {
        setExpanded(true);
    }

    function collapse() {
        setExpanded(false);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                collapse();
            }
        }

        //don't quite understand why the event listener below was added and 
        //then removed but it seems like a crucial logic to prevent errors
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cardRef]);

    const [card, setCard] = useState({
        client_name: "",
        deal_description: "",
        deal_value: "",
        owner_name: props.userName,
        last_activity_at: "",
        lead_source: "",
        time_in_stage: "",
        columnName: props.columnName
    });

    function submitForm() {
        props.onAdd(card);
        setCard({
            client_name: "",
            deal_description: "",
            deal_value: "",
            owner_name: props.userName,
            last_activity_at: "",
            lead_source: "",
            time_in_stage: "",
            columnName: props.columnName
        });
        collapse();
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
            <div ref={cardRef} className='{styles.cardParent}' style={{height: isExpanded? "300px": '' }}>
                <div className='{styles.card}'>
                    <h3>{card.owner_name}</h3>
                    <input className='{styles.input}'
                      type="text"
                      name="client_name"
                      value={card.client_name}
                      onChange={handleChange}
                        placeholder="Client Name"
                        style={{background: "transparent"}}
                    />

                   <input className='{styles.input}'
                      type="number"
                      name="deal_value"
                      value={card.deal_value}
                      onChange={handleChange}
                      onClick={expand}
                      placeholder="How much is the deal worth"
                      style={{background: "transparent"}}
                   />

                   <input className='{styles.input}'
                    type="text"
                     name="deal_description"
                       value={card.deal_description}
                       onChange={handleChange}
                     placeholder="Add a description"
                     style={{display: isExpanded? '': "none", background: "transparent"}}
                     />
                     <div className='{styles.bottomSection}' >

                    <input className='{clsx(styles.input, styles.date)}' style={{display: isExpanded? '': "none" }} 
                        type="date"
                        name="last_activity_at"  
                        onChange={handleChange}
                        value={card.last_activity_at}
                        placeholder="when was the last contact" 
                    />
                    <input className='{styles.input}' style={{display: isExpanded? '': "none" }} 
                        type="text"
                        name="lead_source"  
                        onChange={handleChange}
                        value={card.lead_source}
                        placeholder="source of the lead" 
                    />
                    <h3>{card.time_in_stage}</h3>
                    </div>



                    <div className='{`${styles.icons}`}'>
                          <button className='{clsx(styles.add)}' style={{display: isExpanded? '': "none"}} onClick={submitForm}>
                              <AddIcon style={{ color: 'white' }} />
                          </button>
                    </div>    
                </div>
            </div>
    );
};

export default Card;
