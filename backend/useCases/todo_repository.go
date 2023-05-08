package useCases

import "github.com/washogo/gogo-todo-app/domain"

type TodoCreateData struct {
	Title			 string
	Description string
}

type TodoUpdateData struct {
	ID					 int
	Title			 string
	Description string
}

type TodoOutputData struct {
	Todo domain.Todo
}

type TodoRepository interface {
	GetAll() ([]TodoOutputData, error)
	Create(TodoCreateData) error
	Update(TodoUpdateData) error
	Delete(id int64) error
}