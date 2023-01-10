import axios from "axios";
import { useEffect, useState } from "react"
import './MyApp.css'
import TodoList from "./TodoList";
// import WaitingPage from "./WaitingPage";
import swal from 'sweetalert'

const MyApp = () => {
    // For Loading Text
    const [isLoading, setIsLoading] = useState(true);
    // Todos, hasMore
    const [toDos, setToDos] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    // New Todo
    const [newTodo, setNewTodo] = useState("");


    // 
    useEffect(() => {
        // Fetch Todos
        fetchTodos()
    }, [])
    
    

    // Fetch Data
    const fetchTodos = () => {
        // need to change the page number and send request again, till all the data were fetched
        axios.get(`http://localhost:3000/server/ToDoList/all?page=1&perPage=200`)
        .then(res => {
            const todos = res.data.data
            setToDos(todos.todoItems)
            setHasMore(todos.hasMore)
            // Loading -> false
            setIsLoading(false)
        })
    }

    // Add New Todo
    const handleAdd = async () => {
        // e.preventDefault();
        // console.log(newTodo);
        // If Todo is empty, show alert
        if (newTodo === "") {
            swal("Alert!","Todo cannot be empty!")
        }
        // add to DB
        else{
            await axios.post("http://localhost:3000/server/ToDoList/add",{
                "notes" : newTodo
            })    
        }
    }

    // Popup with wait message - no buttons, escape actions, - Sweetalert
    const waitMessage = () => {
        swal("Please wait...",{
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: false
        })
    }

    // close sweetalert popup
    const closeSwal = () => {
        swal.close();
    }


    return(
        <div className="App">
            {/* Loading Text... */}
            {isLoading && <div>Loading...</div>}
            {/* {isLoading && <WaitingPage />} */}
            {/* Header */}
            <h1>Todos</h1>
            <main>
                <section className="new-todo">
                    {/* Input for Adding new Todo */}
                    <input
                        type="text"
                        name="newTodo"
                        value={newTodo}
                        placeholder="Add New Task..."
                        onChange={e => setNewTodo(e.target.value)}
                    />
                    {/* Add Button */}
                    <input type="submit" value="Add" className="add-new" onClick={handleAdd} />
                    {/* <p>{newTodo}</p> */}
                </section>
                <section className="all-todos">
                    {/* {toDos.length === 0 && <div>No Todos, Add some..</div>} */}
                    {toDos.length !== 0 ? <TodoList todos={toDos} setToDos={setToDos}/> : <div>No Todos, Add some..</div>}
                </section>
            </main>
            {/* {toDos.length !==0 && JSON.stringify(toDos)} */}
        </div>
    )
}

export default MyApp