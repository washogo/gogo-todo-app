package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"github.com/go-playground/validator/v10"

	"github.com/washogo/gogo-todo-app/useCases"
)

// TodoController はtodoのコントローラー
// リクエストに対するレスポンスを定義する
// 外部パッケージに公開するインタフェース
type TodoController interface {
	GetAll(w http.ResponseWriter, r *http.Request)
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
}

// todoController はtodoのコントローラー
// リクエストに対するレスポンスを定義する
// 内部パッケージに公開する構造体
type todoController struct {
	todoUseCase *useCases.TodoUseCase
}

// NewTodoController はtodoのコントローラーを生成する
// コントローラーはuseCaseを受け取る
func NewTodoController(todoUseCase *useCases.TodoUseCase) TodoController {
	return &todoController{
		todoUseCase: todoUseCase,
	}
}

// CORS対応
func setCorsHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

// バリデーションを行う
func validate(target interface{}) error {
	validate := validator.New()
	return validate.Struct(target)
}

// エラーレスポンスの設定を行う
func setErrorResponse(message string, w http.ResponseWriter, statusCode int) {
	errorMessage := map[string]string{"message": message}
	jsonMessage, _ := json.Marshal(errorMessage)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(jsonMessage)
}

// GetAll はtodoの一覧を取得する
func (tc *todoController) GetAll(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)
	todos, err := tc.todoUseCase.GetAll()
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	// レスポンスのtodosをjsonに変換してレスポンスバディに書き込み
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

// Create はtodoを作成する
func (tc *todoController) Create(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)

	var tcd useCases.TodoCreateData
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&tcd); err != nil {
		log.Println(err)
		setErrorResponse("リクエストの形式が間違っています", w, http.StatusBadRequest)
		return
	}

	// バリデーションを実行する
	if err := validate(tcd); err != nil {
		log.Println(err)
		setErrorResponse("リクエストの形式が間違っています", w, http.StatusBadRequest)
		return
	}

	err := tc.todoUseCase.Create(tcd)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}

// Update はtodoを更新する
func (tc *todoController) Update(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)
	var tud useCases.TodoUpdateData
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&tud); err != nil {
		log.Println(err)
		setErrorResponse("リクエストの形式が間違っています", w, http.StatusBadRequest)
		return
	}

	if err := validate(tud); err != nil {
		log.Println(err)
		setErrorResponse("リクエストの形式が間違っています", w, http.StatusBadRequest)
		return
	}

	err := tc.todoUseCase.Update(tud)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// Delete はtodoを削除する
func (tc *todoController) Delete(w http.ResponseWriter, r *http.Request) {
	setCorsHeaders(w)

	var deleteParams struct {
		ID int64 `json:"id" validate:"required"`
	}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&deleteParams); err != nil {
		log.Println(err)
		setErrorResponse("リクエストの形式が間違っています", w, http.StatusBadRequest)
		return
	}

	// バリデーションを実行する
	if err := validate(deleteParams); err != nil {
		log.Println(err)
		setErrorResponse("リクエストの形式が間違っています", w, http.StatusBadRequest)
		return
	}

	err := tc.todoUseCase.Delete(deleteParams.ID)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
