const TodoList = ({todos}) => {

    // console.log(todos)

    return(
        <ol>
            {todos.map(todo => (
                <li className="todo" key={todo.id}>{todo.notes}</li>
            ))}
        </ol>
    )

}

export default TodoList;