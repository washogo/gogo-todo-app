package useCases

type TodoUseCase struct {
	repo TodoRepository
}

func NewTodoUseCase(repo TodoRepository) *TodoUseCase {
	return &TodoUseCase{
		repo: repo,
	}
}

func (uc *TodoUseCase) GetAll() ([]TodoOutputData, error) {
	return uc.repo.GetAll()
}

func (uc *TodoUseCase) Create(tcd TodoCreateData) error {
	return uc.repo.Create(tcd)
}

func (uc *TodoUseCase) Update(tud TodoUpdateData) error {
	return uc.repo.Update(tud)
}

func (uc *TodoUseCase) Delete(id int64) error {
	return uc.repo.Delete(id)
}
