import axios from "axios";
import { useEffect, useState } from "react"
import './MyApp.css'
import TodoList from "./TodoList";

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
        await axios.post("http://localhost:3000/server/ToDoList/add",{
            "notes" : newTodo
        })
    }


    return(
        <div className="App">
            {/* Loading Text... */}
            {isLoading && <div>Loading...</div>}
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
                    <button type="button" className="add-new" onClick={handleAdd}>Add</button>
                    <p>{newTodo}</p>
                </section>
                <section className="all-todos">
                    {toDos.length === 0 && <div>No Todos, Add some..</div>}
                    {toDos.length !== 0 && <TodoList todos={toDos}/>}
                </section>
            </main>
            {/* {toDos.length !==0 && JSON.stringify(toDos)} */}
        </div>
    )
}

export default MyApp