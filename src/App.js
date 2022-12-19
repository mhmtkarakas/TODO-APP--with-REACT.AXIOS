import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function App() {
  const [todolar, setTodolar] = useState(null);
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [regulation,setRegulation] = useState(false)
  const [regulatedTodo,setRegulatedTodo] = useState(null)
  const [regulatedTitle,setRegulatedTitle] = useState("");

  const todoSil = (id) => {
    axios
      .delete(`http://localhost:3004/todos/${id}`)
      .then((response) => {
        setResult(true);
        setResultMessage("silme işlemi başarili");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("silme işlemi esnasinda hata oluştu");
      });
  };

  const changedTodosCompleted = (todo) => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };
    axios
      .put(`http://localhost:3004/todos/${todo.id}`, updatedTodo)
      .then((response) => {
        setResult(true);
        setResultMessage("Todo başariyla güncellendi");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("Güncelleme işleminde hata oluştu");
      });
  };
   
  const checkRegulatedForm =(event)=>{
    event.preventDefault()
    // Validation
    if(regulatedTitle==="" ){
      alert("regulatedTitle do not be empty" )
    }
    const updatedTodo ={
      ...regulatedTodo,
      title:regulatedTitle
    }
    axios.put(`http://localhost:3004/todos/${updatedTodo.id}`,updatedTodo)
    .then((response)=>{
      setResult(true);
      setResultMessage("Todo başariyla güncellendi");
      setRegulation(false)
    })
    .catch((error)=>{
      setResult(true);
      setResultMessage("Todo Güncellenemedi");
    })
  }

  useEffect(() => {
    axios
      .get("http://localhost:3004/todos")
      .then((response) => {
        console.log(response.data);
        setTodolar(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [result]);

  const formuDenetle = (event) => {
    event.preventDefault();
    //Validation
    if (title === "") {
      alert("Please set the title");
      return;
    }
    // create and save todo
    const newTodo = {
      id: String(new Date().getTime()),
      title: title,
      date: new Date(),
      completed: false,
    };

    axios
      .post("http://localhost:3004/todos", newTodo)
      .then((respone) => {
        //setTodolar([...todolar, newTodo]);
        setTitle("");
        setResult(true);
        setResultMessage("Kayit İşlemi Başarili");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("Kaydederken bir hata oluştu");
      });
  };

  if (todolar === null) {
    return null;
  }
  return (
    <div className="App">
      <div className="container">
        {result === true && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <div className="alert alert-success" role="alert">
              <p>{resultMessage}</p>
              <div className="d-flex justify-content-center">
                <button
                  onClick={() => setResult(false)}
                  className="btn btn-sm btn-outline-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="row my-5">
          <form onSubmit={formuDenetle}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Add your text..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <button className="btn btn-info" type="submit">
                ADD
              </button>
            </div>
          </form>
        </div>
        {regulation === true && (
            <div className="row my-5">
            <form onSubmit={checkRegulatedForm}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add your text..."
                  value={regulatedTitle}
                  onChange={(event)=>setRegulatedTitle(event.target.value)}
                />
                <button onClick = {()=>setRegulation(false)} className="btn btn-danger" >
                  Vazgeç
                </button>
                <button className="btn btn-info" type="submit">
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        )}
        {todolar.map((todo) => (
          <div
            className="alert alert-secondary d-flex justify-content-between align-items-center"
            role="alert"
          >
            <div>
              <h1
                style={{
                  textDecoration:
                    todo.completed === true ? "line-through" : "none",
                  color: todo.completed === true ? "red" : "black",
                }}
              >
                {todo.title}
              </h1>
              <p>{new Date(todo.date).toLocaleString()}</p>
            </div>
            <div>
              <div class="btn-group" role="group" aria-label="Basic example">
                <button onClick={()=>{setRegulation(true);
                setRegulatedTodo(todo)
              }}
                
                type="button" className="btn btn-small btn-warning">
                  Düzenle
                </button>
                <button
                  onClick={() => todoSil(todo.id)}
                  type="button"
                  className="btn btn-small btn-danger"
                >
                  Sil
                </button>
                <button
                  onClick={() => changedTodosCompleted(todo)}
                  type="button"
                  className="btn btn-small btn-primary"
                >
                  {todo.completed === true ? "Yapilmadi" : "Yapildi"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
