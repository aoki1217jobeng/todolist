document.addEventListener("DOMContentLoaded", () => {
    console.log("jsファイル読み込み完了");
    loadData();
})

const itemTmpl = document.querySelector("#todo-item-tmpl")
const spanItem = itemTmpl.querySelector("span")
//const li = spanItem.closest()
const createInput = document.querySelector("#create-input")
const todoList = document.querySelector("#todo-list")
const createBtn = document.querySelector("#create-btn")
const deleteBtn = document.querySelector("#delete-btn")
const completeBtn = document.querySelector("#complete-btn")


function createTodoItem(){
    const text = createInput.value
    if(text === "")return;

    const clone = itemTmpl.content.cloneNode(true)
    clone.querySelector("span").textContent = text;
    const li = clone.querySelector(".todo-item");
    li.classList.add("new-item");
    todoList.append(li);
    createInput.value = "";

    saveTodo();
}

createBtn.addEventListener("click", createTodoItem)

function deleteItem(event){
    const li = event.target.closest("li");
    li.remove();
    saveTodo();
}

todoList.addEventListener("click", event => {
    if(event.target.classList.contains("delete-btn")){
        deleteItem(event);
    }
})

function completeItem(event){
    const li = event.target.closest("li");
    li.classList.add("completed");
    saveTodo();
}

todoList.addEventListener("click", event => {
    if(event.target.classList.contains("complete-btn")){
        completeItem(event);
    }
})

createInput.addEventListener("keydown", event => {
    if(event.key === "Enter"){
        createTodoItem();
    }
})


const clock = document.querySelector("#clock")

function timeshow(){
    const now = new Date().toLocaleTimeString("ja-JP", {
        hour12: false
    });
    clock.textContent = now 
} 
setInterval(timeshow, 1000);


function saveTodo(){
    const data =[]
    const items = todoList.querySelectorAll("li.todo-item")
    items.forEach(li => {
        const span = li.querySelector("span")
        if(!span)return;

        const text = span.textContent;
        const completed = li.classList.contains("completed");
        data.push({text, completed});
    });

    localStorage.setItem("todos", JSON.stringify(data));

}

function loadData(){
    const saved = localStorage.getItem("todos");
    if(!saved)return;

    const data = JSON.parse(saved);

    data.forEach(item => {
        const clone = itemTmpl.content.cloneNode(true);
        const li = clone.querySelector(".todo-item");
        li.querySelector("span").textContent = item.text;
        
        if(item.completed){
            li.classList.add("completed"); 
        }

        todoList.append(li);
    })
    console.log("JSON読み込み完了")
}


//stopwatch, countdown
const stopwatchEl = document.querySelector("#stopwatch")
const modeupBtn = document.querySelector("#mode-up")
const modedownBtn = document.querySelector("#mode-down")
const startBtn = document.querySelector("#start")
const stopBtn = document.querySelector("#stop")
const resetBtn = document.querySelector("#reset")
const minInput = document.querySelector("#countdown-min")
const secInput = document.querySelector("#countdown-sec")


let mode = "up";
let timerId = null;
let elapsedSec = 0;
let remainingSec = 0;

//秒数をMM::SSにフォ－マット
function formattime(sec){
    const m = Math.floor(sec/60);
    const s = sec%60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2,'0')}`;
}

//表示更新
function renderStopwatch(){
    if(mode==="up"){
        stopwatchEl.textContent = formattime(elapsedSec);
    }else{
        stopwatchEl.textContent = formattime(Math.max(remainingSec, 0))
    }
}

//モード切替
function setMode(newMode){
    mode = newMode;
    modeupBtn.classList.toggle("active", mode === "up")
    modedownBtn.classList.toggle("active", mode === "down")

    //カウントダウンのときだけ入力欄を有効に
    minInput.disabled = (mode ==="up");
    secInput.disabled = (mode ==="up");
    
    if(mode === "up"){
        elapsedSec =0;
    }else{
        const min = Number(minInput.value) || 0;
        const sec = Number(secInput.value) || 0;
        remainingSec = min*60 + sec;
    }
    renderStopwatch();
}

modeupBtn.addEventListener("click", () => {setMode("up")})
modedownBtn.addEventListener("click", () => {setMode("down")})

startBtn.addEventListener("click", () => {
    if(timerId !== null)
    if(mode === "down"){
        const min = Number(minInput.value) || 0;
        const sec = Number(secInput.value) || 0;
        remainingSec = min*60+sec;
        if(remainingSec <= 0){
            alert("1秒以上を設定してください")
            return;
        }
    }

    timerId = setInterval(() => {
        if(mode === "up"){
            elapsedSec++;
            renderStopwatch();
        }else{
            remainingSec--;
            renderStopwatch();
            if(remainingSec <= 0){
                clearInterval(timerId);
                timerId = null;
                alert("カウントダウン終了")
            }
        }
    }, 1000)
});

stopBtn.addEventListener("click", () => {
    if(timerId !== null){
        clearInterval(timerId);
        timerId = null;
    }
});

resetBtn.addEventListener("click", () => {
    if(timerId !== null){
        clearInterval(timerId);
        timerId = null;
    }

    if(mode === "up"){
        elapsedSec = 0;
    }else{
        const min = Number(minInput.value) || 0
        const sec = Number(secInput.value) || 0
        remainingSec = min*60 + sec;
    }
    renderStopwatch();
});

//初期表示
setMode("up")
