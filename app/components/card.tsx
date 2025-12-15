"use client"; // This component needs client-side features like useState and useEffect

import { useState, useRef, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import clsx from 'clsx';
import styles from './card.module.css';


function Card(props: any) {
    const [isExpanded, setExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const addCardRef = useRef<HTMLDivElement>(null);

    function expand() {
        setExpanded(true);
    }

    function collapse() {
        setExpanded(false);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                cardRef.current && !cardRef.current.contains(event.target as Node) &&
                addCardRef.current && !addCardRef.current.contains(event.target as Node)
            ) {
                collapse();
            }
        }

        //don't quite understand why the event listener below was added and 
        //then removed but it seems like a crucial logic to prevent errors
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cardRef, addCardRef]);

    const [card, setCard] = useState({
        client_name: "",
        deal_description: "",
        deal_value: "",
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
            last_activity_at: "",
            lead_source: "",
            time_in_stage: "",
            columnName: props.columnName
        });
        collapse();
    }

 
    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
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
        <div className="flex w-full flex-col gap-[20px] justify-center items-center">
            <div ref={cardRef} className={styles.cardParent} style={{display: isExpanded? '': 'none', height: "300px"}}>
                <div className={clsx(styles.card, 'bg-white')}>
                    <input className={clsx('rounded-lg border border-dashed border-[#547792]')}
                      type="text"
                      name="client_name"
                      value={card.client_name}
                      onChange={handleChange}
                        placeholder="Client Name"
                        style={{background: "transparent"}}
                    />

                   <input className={clsx('rounded-lg border border-dashed border-[#547792]')}
                      type="number"
                      name="deal_value"
                      value={card.deal_value}
                      onChange={handleChange}
                      onClick={expand}
                      placeholder="How much is the deal worth"
                      style={{background: "transparent"}}
                   />

                   <textarea className={clsx('rounded-lg border border-dashed border-[#547792] h-[80px]')}
                     name="deal_description"
                       value={card.deal_description}
                       onChange={handleChange}
                     placeholder="Add a description"
                     />

                    <input className={clsx('rounded-lg border border-dashed border-[#547792]')}
                        type="date"
                        name="last_activity_at"  
                        onChange={handleChange}
                        value={card.last_activity_at}
                        placeholder="when was the last contact" 
                    />
                    <input className={clsx('rounded-lg border border-dashed border-[#547792]')}
                        type="text"
                        name="lead_source"  
                        onChange={handleChange}
                        value={card.lead_source}
                        placeholder="source of the lead" 
                    />
                    <h3>{card.time_in_stage}</h3>



                       
                </div>
                
            </div>
            <div ref={addCardRef} className={styles.addCard}>
                {isExpanded?
                  <button className='flex justify-self-start font-bold h-[30px] w-[100px] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 px-4 py-2 text-sm justify-center items-center' onMouseDown={(e) => e.stopPropagation()} onClick={submitForm}>Add Card</button>
                    :
                  <h3 className="flex justify-self-start font-bold">Add Card</h3>
                }
                  <button onClick={expand} style={{display: isExpanded? 'none': ''}}>
                      <AddIcon style={{ color: 'blue' }} />
                  </button>
            </div> 
        </div>    
    );
};

export default Card;
