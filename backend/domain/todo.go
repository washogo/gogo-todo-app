package domain

type Todo struct {
	ID          int64    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}
