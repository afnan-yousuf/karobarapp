"use client";
import { useEffect, useState } from "react";

export default function Todos() {
  const [todos, setTodos] = useState([]);

  console.log("loading");
  
  useEffect(() => {
    setTodos([{
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    },
    {
      userId: 1,
      id: 2,
      title: "quis ut nam facilis et officia qui",
      completed: false,
    },
    {
      userId: 1,
      id: 3,
      title: "fugiat veniam minus",
      completed: false,
    },]);
  }, []);

  return (
    <>
      <div className="flex justify-between mt-5">
        {todos.map((t, i) => {
          return (
            <div key={i} className="border p-4">
              <h1>{t.title}</h1>
              <p>{t.userId}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
