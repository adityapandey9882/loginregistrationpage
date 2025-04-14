"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { TodoItem } from "./todo-item"

interface Todo {
  id: string
  title: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) console.error(error)
    else setTodos(data || [])
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    const { error } = await supabase
      .from("todos")
      .insert([{ title: newTodo }])

    if (error) console.error(error)
    else {
      setNewTodo("")
      fetchTodos()
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addTodo} className="flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
        />
        <Button type="submit">Add</Button>
      </form>
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={fetchTodos}
          />
        ))}
      </div>
    </div>
  )
}