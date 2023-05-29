import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import pb from "./connector/pocketbase.js";
import TodoHeader from "./TodoHeader.jsx";
import DisplayTodoItems from "./DisplayTodoItems.jsx";
import EditingTodo from "./EditingTodo.jsx";

function TodoInfo() {
  const { id } = useParams(); // ดึงค่า ID จาก URL param

  const [todo, setTodo] = useState({}); // Todo ที่จะแสดง
  const [isEditing, setIsEditing] = useState(false); // กำลัง Edit อยู่หรือไม่
  const [title, setTitle] = useState(""); // ชื่อ Todo

  const getTodo = async () => {
    const fetchedTodo = await pb.collection("todo").getOne(id, {
      expand: "todoItem",
    }); // ทำการ Fetch Todo ที่มี ID ตามที่ระบุ
    setTodo(fetchedTodo);
  };

  useEffect(() => {
    getTodo();
  }, [id]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const updateTodo = async (todo) => {
    const updatedTodo = await pb.collection("todo").update(id, todo, {
      expand: "todoItem",
    });
    setTodo(updatedTodo);
    setIsEditing(false);
  };

  // เพิ่ม todoItem ลงใน Collection todoItem ใน Pocketbase
  const addTodoItem = async () => {
    console.log("addTodoItem");
  };

  // ลบ todoItem ออกจาก Collection todoItem ใน Pocketbase
  const deleteTodoItem = async (todoItemId) => {
    console.log("deleteTodoItem", todoItemId);
  };

  // อัพเดท todoItem ใน Collection todoItem ใน Pocketbase
  const checkTodoItem = async (todoItemId) => {
    console.log(todoItemId);
    // const todoItemInfo = todo..find((todoItem) => todoItem.id === todoItemId);
    // const updatedTodoItem = await pb.collection("todoItem").update(todoItemId, {
    //   completed: !todoItemInfo.completed,
    // });

    // setTodoItem(todo.map((todoItem) => (todoItem.id === todoItemId ? updatedTodoItem : todoItem)));
  };

  return (
    <div className="w-full flex justify-center p-4">
      <div className="w-96 space-y-2">
        <h1 className="text-3xl">Todo App</h1>
        {!isEditing ? (
          <TodoHeader todo={todo} editTodo={() => setIsEditing(!isEditing)} />
        ) : (
          <EditingTodo todo={todo} updateTodo={updateTodo} />
        )}
        <hr />
        <div className="flex w-ful gap-2">
          <input onChange={handleTitleChange} value={title} type="text" className="border shadow rounded w-full p-1" />
          <button
            onClick={addTodoItem}
            className="p-2 rounded bg-green-500 hover:bg-green-400 active:bg-green-500 active:scale-95 text-white transition"
          >
            Add
          </button>
        </div>
        <hr />
        <DisplayTodoItems todoItems={todo?.todoItems || []} deleteTodoItem={deleteTodoItem} checkTodoItem={checkTodoItem} />
      </div>
    </div>
  );
}

export default TodoInfo;
