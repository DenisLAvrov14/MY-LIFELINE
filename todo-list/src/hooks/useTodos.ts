import { useQuery } from "@tanstack/react-query";
import todosService from "../services/todos.service";

export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: todosService.getTodos,
    select: (data) => data,
    retry: 2,
  });
};
