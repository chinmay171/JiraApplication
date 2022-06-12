let addbtn = document.querySelector(".add-btn");
let modal = document.querySelector(".modal-cont")
let taskAreaCont = document.querySelector(".textarea-cont");
let mainCont = document.querySelector(".main-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");
let removebtn = document.querySelector(".delete-btn")
let toolBoxColors = document.querySelectorAll(".colour");
let colors = ["lightPink","lightBlue","lightGreen","black"];
let ticketColor = colors[colors.length-1];
let addModal = true;
let removeModal = false;
var uid = new ShortUniqueId();
let ticketArr = [];

if(localStorage.getItem("tickets")){
    let str = localStorage.getItem("tickets");
    let arr = JSON.parse(str);
    ticketArr = arr;
    for(let i = 0; i<arr.length; ++i){
        let ticketObj = arr[i];
        createTicket(ticketObj.color, ticketObj.task, ticketObj.id);
    }
}

for(let i = 0; i <toolBoxColors.length; ++i){
    toolBoxColors[i].addEventListener("click", function(){
        let currColor = toolBoxColors[i].classList[1];
        let filteredArr = [];
        for(let i = 0; i<ticketArr.length; ++i){
            if(ticketArr[i].color == currColor){
                filteredArr.push(ticketArr[i]);
            }
        }
        console.log(filteredArr);
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let j = 0; j<allTickets.length; ++j){
            allTickets[j].remove();
        }
        for(let i = 0; i<filteredArr.length; ++i){
            let ticket = filteredArr[i];
            createTicket(ticket.color, ticket.task, ticket.id);
        }
    })

    toolBoxColors[i].addEventListener("dblclick", function(){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].remove();
        }
        for (let i = 0; i < ticketArr.length; i++) {
            let ticket = ticketArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTicket(color, task, id)
        }
    })
}


addbtn.addEventListener("click", function(){
    if(addModal){
        modal.style.display = "flex";
    }else{
        modal.style.display = "none";
    }
    addModal = !addModal
})

removebtn.addEventListener("click", function(){
    if(!removeModal){
        removebtn.style.color = "red";
    }else{
        removebtn.style.color = "black";
    }
    removeModal = !removeModal;
})

for(let i = 0; i<allPriorityColor.length; ++i){
    let priorityAtCurrentDiv = allPriorityColor[i];
    priorityAtCurrentDiv.addEventListener("click", function(){
        for(let j = 0; j<allPriorityColor.length; ++j){
            allPriorityColor[j].classList.remove("active");
        }
        priorityAtCurrentDiv.classList.add("active");
        ticketColor = priorityAtCurrentDiv.classList[0];
    })
}

modal.addEventListener("keydown", function(e){
    let key = e.key;
    if(key == "Enter"){
        // console.log("entered")
        createTicket(ticketColor, taskAreaCont.value);
        taskAreaCont.value = "";
        modal.style.display = "none";
        addModal = !addModal;
    }
})

function createTicket(ticketColor, ticketText,ticketId){
    let id;
    if(ticketId == undefined){
        id = uid();
    }else{
        id = ticketId;
    }
    // <div class="ticket-cont">
    //         <div class="ticket-color lightGreen"></div>
    //         <div class="ticket-id">###1231</div>
    //         <div class="task-area">Task1</div>
    //     </div>
    //handle creation of ticket
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                                            <div class="ticket-id">#${id}</div>
                                            <div class="task-area">${ticketText}</div>
                                            <div class= "lock-unlock"><i class="fa fa-lock"></i></div>`
    mainCont.appendChild(ticketCont);
    //handle deletion of ticket
    ticketCont.addEventListener("click", function(){
        if(removeModal){
            ticketCont.remove();
            let ticketIdRemove
            for(let i = 0; i<ticketArr.length;++i){
                if(ticketArr[i].id == id){
                    ticketIdRemove = i;
                    break;
                }
            }
            ticketArr.splice(ticketIdRemove, 1);
            updateLocalStorage();
        }
    })
    //handle change of color of ticketColor
    let ticketColorBand = ticketCont.querySelector(".ticket-color");
    ticketColorBand.addEventListener("click", function(){
        let currTicketColor = ticketColorBand.classList[1];
        let currTicketColorIdx = -1;
        for(let i = 0; i<colors.length; ++i){
            if(currTicketColor == colors[i]){
                currTicketColorIdx = i;
                break;
            }
        }
        let nextColorIdx = (currTicketColorIdx +1)%colors.length;
        let nextColor = colors[nextColorIdx];
        ticketColorBand.classList.remove(currTicketColor);
        ticketColorBand.classList.add(nextColor);

        let TicketIdcolor;
        for(let i = 0; i<ticketArr.length;++i){
            if(ticketArr[i].id == id){
                TicketIdcolor = i;
                break;
            }
        }
        ticketArr[TicketIdcolor].color = nextColor;
        updateLocalStorage();
    })
    //handle lock-unlock setting
    let lockUnlockBtn = ticketCont.querySelector(".lock-unlock i");
    let taskAreaContent = ticketCont.querySelector(".task-area");
    lockUnlockBtn.addEventListener("click", function(){
        if(lockUnlockBtn.classList.contains("fa-lock")){
            lockUnlockBtn.classList.remove("fa-lock");
            lockUnlockBtn.classList.add("fa-unlock");
            taskAreaContent.setAttribute("contenteditable","true");
        }else{
            lockUnlockBtn.classList.remove("fa-unlock");
            lockUnlockBtn.classList.add("fa-lock");
            taskAreaContent.setAttribute("contenteditable","false");
        }
        let ticketTextID;
        for(let i = 0; i<ticketArr.length;++i){
            if(ticketArr[i].id == id){
                ticketTextID = i;
                break;
            }
        }
        ticketArr[ticketTextID].task = taskAreaContent.textContent;
        updateLocalStorage();
    })
    if(ticketId == undefined){
        ticketArr.push({"color" : ticketColor, "task" : ticketText, "id" : id})
        updateLocalStorage();
    }
}

function updateLocalStorage(){
    let strigifyArr = JSON.stringify(ticketArr);
    localStorage.setItem("tickets", strigifyArr);
}