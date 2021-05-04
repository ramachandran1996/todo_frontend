import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { Button, Grid, Container, Paper, TextField } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

function App() {
  let textInput = useRef(null);
  const [isdata, setIsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [userId, setUserId] = useState("");

  const [inputValue, setInputValue] = React.useState("");

  const onChangeHandler = (event) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    getApi();
  }, []);

  const getApi = () => {
    const apiUrl = "http://localhost:5000/users";
    fetch(apiUrl)
      .then((response) => response.json())
      .then((res) => {
        setIsData(res);
        setInputValue("");
        setIsLoading(false);
        setIsEdit(false);
        setUserId("");
      });
  };
  console.log(inputValue);
  const postTodo = () => {
    setIsLoading(true);
    const data = {
      username: `${inputValue}`,
      age: "22",
      sex: "male",
    };
    if (!isEdit) {
      fetch("http://localhost:5000/users", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.status === 200) {
            getApi();
          }
          setIsLoading(false);
          console.log(response, "post response");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    if (isEdit) {
      editTodoPost();
    }
  };

  const deleteTodo = (e) => {
    console.log(e);
    setIsLoading(true);
    fetch(`http://localhost:5000/users/${e.id}`, {
      method: "DELETE", // or 'PUT'
    })
      .then((response) => {
        // response.json().then((response) => {
        //   console.log(response);
        // });
        getApi();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editTodo = (e) => {
    setInputValue(e.username);
    textInput.current.focus();
    setIsEdit(true);
    setUserId(e.id);
  };

  const editTodoPost = () => {
    setIsLoading(true);
    const data = {
      username: `${inputValue}`,
    };
    fetch(`http://localhost:5000/users/${userId}`, {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          getApi();
        }
        setIsLoading(false);
        console.log(response, "post response");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const gggg = (e, b) => {
    setIsEdit(true);
    setInputValue(e.username);
    setUserId(e.id);
  };

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13) {
      editTodoPost();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>Todo app</div>
        <input
          type="text"
          name="name"
          onChange={onChangeHandler}
          value={inputValue}
          placeholder={"todo name"}
          ref={textInput}
          style={{
            width: 200,
            height: 40,
            borderRadius: 10,
            textAlign: "center",
            outline: "none",
          }}
        />
        {!isLoading ? (
          isdata.map((item, index) => {
            console.log(!isEdit, userId !== item.id);
            return (
              <Paper
                elevation={3}
                key={index}
                style={{ margin: 10, width: "60%" }}
              >
                <Grid
                  direction="column"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-start"
                    style={{ padding: 10 }}
                  >
                    {userId !== item.id && (
                      <Button onClick={(e) => gggg(item)}>
                        {item.username}
                      </Button>
                    )}
                    {isEdit && userId === item.id && (
                      <TextField
                        fullWidth
                        required
                        // inputRef={textInput}
                        onChange={onChangeHandler}
                        value={inputValue}
                        type="text"
                        onKeyDown={onKeyDownHandler}
                      />
                    )}
                    {/* <div>{item.username}</div> */}
                    <div>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => gggg(item)}
                        style={{ marginRight: 10 }}
                      >
                        edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => deleteTodo(item)}
                      >
                        delete
                      </Button>
                    </div>
                  </Grid>
                  {/* <button onClick={() => deleteTodo(item)}>delete</button> */}
                </Grid>
              </Paper>
            );
          })
        ) : (
          <Paper style={{ backgroundColor: "white" }}>
            <Skeleton variant="rect" width={210} height={18} />
          </Paper>
        )}
        <Button variant="contained" color="primary" onClick={postTodo}>
          add
        </Button>
      </header>
    </div>
  );
}

export default App;
