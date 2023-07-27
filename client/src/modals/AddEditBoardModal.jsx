import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import minusIcon from "../assets/icon-minus.svg";
import { useDispatch } from "react-redux";
import boardSlices from "../redux/boardsSlice";

function AddEditBoardModal({ setBoardModalOpen, type }) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [newColumns, setNewColumns] = useState([
    { name: "Todo", task: [], id: uuidv4() },
    { name: "Done", task: [], id: uuidv4() },
  ]);
  const [isValid, setIsValid] = useState(true);

  const onChange = (id, newValue) => {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      column.name = newValue;
      return newState;
    });
  };
  const onDelete = (id) => {
    setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
  };
  const validate = () => {
    setIsValid(false);
    if (!name.trim()) {
      return false;
    }

    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };
  const onsubmit = () => {
    setBoardModalOpen(false);
    if (type === "add") {
      dispatch(boardSlices.actions.addBoard({ name, newColumns }));
    } else {
      dispatch(boardSlices.actions.editBoard({ name, newColumns }));
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setBoardModalOpen(false);
      }}
      className=" fixed right-0 left-0 top-0 bottom-0 px-2 py-4 scrollbar-hide overflow-scroll z-50 justify-center items-center flex bg-[#00000080] "
    >
      <div className=" scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <h3 className=" text-lg">
          {type === "edit" ? "Edit" : "Add New"} Board
        </h3>

        {/* Task Name */}

        <div className=" mt-8 flex flex-col space-y-3">
          <label className=" text-sm dark:text-white text-gray-500">
            Board Name
          </label>
          <input
            className=" bg-transparent px-4 py-2 outline-none rounded-md text-sm border border-gray-600 focus:outline-[#38ada9] outline-1 ring-0"
            placeholder=" e.g Backend Implement"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            id="board-name-input"
          />
        </div>

        {/* Board Columns */}

        <div className=" mt-8 flex flex-col space-y-3">
          <label className=" text-sm dark:text-white text-gray-500">
            Board Columns
          </label>
          {newColumns.map((column, index) => (
            <div className=" flex items-center w-full">
              <input
                className=" bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#38ada9]"
                value={column.name}
                onChange={(e) => {
                  onChange(column.id, e.target.value);
                }}
                type="text"
              />
              <img
                src={minusIcon}
                className=" cursor-pointer m-4"
                onClick={() => {
                  onDelete(column.id);
                }}
              />
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={() => {
              setNewColumns((state) => [
                ...state,
                { name: "", task: [], id: uuidv4() },
              ]);
            }}
            className=" w-full items-center hover:opacity-75 dark:text-[#38ada9] dark:bg-white text-white bg-[#38ada9] mt-2 py-2 rounded-full"
          >
            + Add New Column
          </button>

          <button
            className=" w-full items-center hover:opacity-75 dark:text-white dark:bg-[#38ada9] mt-8 relative text-white bg-[#38ada9] py-2 rounded-full"
            onClick={() => {
              const isValid = validate();
              if (isValid === true) onsubmit(type);
            }}
          >
            {type === "add" ? "Create New Board" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditBoardModal;
