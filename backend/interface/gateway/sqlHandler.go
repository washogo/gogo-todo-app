package gateway

import (
	"log"

	"github.com/washogo/gogo-todo-app/useCases"

	_ "github.com/go-sql-driver/mysql"

	"database/sql"
)

type TodoRepository struct {
	db *sql.DB
}

func NewTodoRepository(db *sql.DB) useCases.TodoRepository {
	return &TodoRepository{db}
}

func (t *TodoRepository) GetAll() ([]useCases.TodoOutputData, error) {
	rows, err := t.db.Query("SELECT * FROM todos")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []useCases.TodoOutputData
	for rows.Next() {
		var todo useCases.TodoOutputData
		if err := rows.Scan(&todo.Todo.ID, &todo.Todo.Title, &todo.Todo.Description); err != nil {
			log.Fatal(err)
			return nil, err
		}
		todos = append(todos, todo)
	}
	return todos, nil
}

func (t *TodoRepository) Create(tcd useCases.TodoCreateData) error {
	_, err := t.db.Exec("INSERT INTO todos (title, description) VALUES (?, ?)", tcd.Title, tcd.Description)

	if err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}

func (t *TodoRepository) Update(tud useCases.TodoUpdateData) error {
	_, err := t.db.Exec("UPDATE todos SET title = ?, description = ? WHERE id = ?", tud.Title, tud.Description, tud.ID)
	if err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}

func (t *TodoRepository) Delete(id int64) error {
	_, err := t.db.Exec("DELETE FROM todos WHERE id = ?", id)
	if err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}
