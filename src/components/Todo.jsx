import React, { useState } from "react";

const Todo = () => {
  const [inputvalue, setInputvalue] = React.useState("");
  const [todos, setTodos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalpage] = useState("");
  React.useEffect(() => {
    getTodos();
  }, [page]);
  const getTodos = () => {
    setIsLoading(true);
    fetch(` http://localhost:3001/todos?_page=${page}&_limit=3`)
      .then((res) => {
        setTotalpage(res.headers.get("X-Total-Count"));
        return res.json();
      })
      .then((res) => {
        setTodos(res);
        setIsError(false);
      })
      .catch((err) => setIsError(true))
      .finally(() => setIsLoading(false));
  };
  const handlechange = (e) => {
    setInputvalue(e.target.value);
    console.log(todos);
  };
  const handleAdd = () => {
    if (inputvalue === "") {
      alert("Pls Enter valid task");
      return;
    }
    const payload = {
      title: inputvalue,
      status: false,
    };
    const payloadjson = JSON.stringify(payload);
    setIsLoading(true);
    fetch(`http://localhost:3001/todos`, {
      method: "Post",
      body: payloadjson,
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        // console.log(res);
        getTodos();
      })
      .catch((err) => setIsError(true))
      .finally(() => setIsLoading(false));
    console.log(todos);
  };
  return isLoading ? (
    <div>...Loading</div>
  ) : isError ? (
    <div>...Error.. something went wrong</div>
  ) : (
    <div>
      <input
        placeholder="Add Todos"
        value={inputvalue}
        onChange={handlechange}
      />
      <button onClick={handleAdd}>Add</button>
      {todos.map((item) => {
        return <h4 key={item.id}>{item.title}</h4>;
      })}
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Prev
      </button>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === Math.ceil(totalpage / 3)}
      >
        Next
      </button>
    </div>
  );
};

export default Todo;
