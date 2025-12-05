

export default function Header(props: any){
    return(
        <div className={props.className}>
            <div className='{styles.header}'>
                <h3 style={{textAlign: "center"}}> To Do</h3>
            </div>
            <div className='{styles.header}'>
                <h3 style={{textAlign: "center"}}> In Progress</h3>
            </div>
            <div className='{styles.header}'>
                <h3 style={{textAlign: "center"}}> On Hold</h3>
            </div>
        </div>
    )
}