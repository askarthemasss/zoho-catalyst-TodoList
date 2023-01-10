import axios from "axios";
import swal from 'sweetalert'

const TodoList = ({todos, setToDos}) => {

    const handleDelete = async (taskID) => {
        let response = await swal("Are you sure to Delete the Task?",{
            buttons: {
                No: true,
                Yes: true,
            }
        })
        // console.log(response);
        if(response === "Yes"){
            let deletedTask = await axios.delete(`http://localhost:3000/server/ToDoList/${taskID}`)
            let deleteTaskID = deletedTask.data.data.todoItem.id;
        }
    }

    return(
        <ol>
            {todos.map(todo => (
                <li className="todo" key={todo.id}>{todo.notes}
                    <span className="material-symbols-outlined" onClick={() => handleDelete(todo.id)}>delete</span>
                </li>
            ))}
        </ol>
    )

}

export default TodoList;