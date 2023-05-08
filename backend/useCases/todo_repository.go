package useCases

import "github.com/washogo/gogo-todo-app/domain"

type TodoCreateData struct {
	Title       string `validate:"required"`
	Description string `validate:"required"`
}

type TodoUpdateData struct {
	ID          int    `validate:"required"`
	Title       string `validate:"required"`
	Description string `validate:"required"`
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
