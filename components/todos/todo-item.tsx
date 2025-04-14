import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"

interface TodoItemProps {
  todo: {
    id: string
    title: string
    completed: boolean
  }
  onUpdate: () => void
}

export function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const toggleComplete = async () => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", todo.id)

    if (error) console.error(error)
    else onUpdate()
  }

  const deleteTodo = async () => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", todo.id)

    if (error) console.error(error)
    else onUpdate()
  }

  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={toggleComplete}
      />
      <span className={todo.completed ? "line-through" : ""}>
        {todo.title}
      </span>
      <Button
        variant="destructive"
        size="sm"
        onClick={deleteTodo}
        className="ml-auto"
      >
        Delete
      </Button>
    </div>
  )
}