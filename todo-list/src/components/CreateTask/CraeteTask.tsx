import React, { ChangeEvent, useCallback, useState } from "react";
import styles from "./CreateTask.module.css";
import { BiSolidPlusCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setFilterValue, addTask } from "../../redux/taskSlice/CreateTaskSlice"; 
import { IconButton } from "../../components/IconButton/IconButton";
import { Filter } from "../../models/InitialTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import todosService from "../../services/todos.service";
import ChangeTheme from "../../components/ChangeTheme/ChangeTheme";

const CreateTask: React.FC = () => {
    const dispatch = useDispatch();
    const [taskDescription, setTaskDescription] = useState<string>("");
    const [filterValue, setLocalFilterValue] = useState<Filter>("all");

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (description: string) => {
          const result = await todosService.createTask(description);
          return result;
        },
        onSuccess: (data) => {
          alert("Task was added");
          dispatch(addTask({ id: data.id, description: data.description, isDone: false }));
          queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
      });
      
      const handleAddTask = useCallback(() => {
        mutation.mutate(taskDescription, {
            onSuccess: async (data) => {
                // Создаем запись в task_times с начальными значениями
                const startTime = new Date();
                const endTime = new Date();
                const duration = 0; // По умолчанию, пока таймер не запущен
    
                // Временный userId, пока нет авторизации
                const userId = 1; // Или замените на фиксированный ID, например, 1
    
                try {
                    await todosService.createTaskTime(data.id, userId, startTime, endTime, duration);
                    alert("Task was added");
    
                    // Добавляем задачу в состояние
                    dispatch(
                        addTask({
                            id: data.id,
                            description: data.description,
                            isDone: false,
                        })
                    );
    
                    // Инвалидируем кэш, чтобы обновить список задач
                    queryClient.invalidateQueries({ queryKey: ["todos"] });
                } catch (error) {
                    console.error("Error creating task time:", error);
                }
            },
        });
        setTaskDescription("");
    }, [mutation, taskDescription, queryClient, dispatch]);
    
     

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTaskDescription(e.target.value);
    }, []);

    const handleFilterChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        const newFilter = event.target.value as Filter;
        setLocalFilterValue(newFilter);
        dispatch(setFilterValue(newFilter));
    }, [dispatch]);

    return (
        <div className={styles.tasker}>
            <div className={styles.ChangeThemeContainer}>
                <ChangeTheme />
            </div>
            <h2>TO DO LIST</h2>
            <div className={styles.addtsk}>
                <input
                    type="text"
                    placeholder="Enter your task"
                    value={taskDescription}
                    onChange={handleInputChange}
                    autoFocus
                />
                <IconButton onClick={handleAddTask}>
                    <BiSolidPlusCircle title="Add task" />
                </IconButton>
                <select onChange={handleFilterChange} value={filterValue}>
                    <option value="all">All</option>
                    <option value="done">Done</option>
                    <option value="undone">Undone</option>
                </select>
            </div>
        </div>
    );
};

export default CreateTask;
