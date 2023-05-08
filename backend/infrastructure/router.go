package infrastructure

import (
	"net/http"

	"github.com/washogo/gogo-todo-app/interface/controllers"
)

// Router はルーティングを定義する
type Router interface {
	// GETリクエストを受け取った時の処理
	GET(controller controllers.TodoController)
	// POSTリクエストを受け取った時の処理
	POST(controller controllers.TodoController)
	// PUTリクエストを受け取った時の処理
	PUT(controller controllers.TodoController)
	// DELETEリクエストを受け取った時の処理
	DELETE(controller controllers.TodoController)
	// ルーティングの実行
	ServeHTTP(w http.ResponseWriter, r *http.Request)
}

// router はルーティングを定義する
type router struct {
	mux *http.ServeMux
}

// NewRouter はルーティングを生成する
func NewRouter(controllers.TodoController) Router {
	return &router{
		mux: http.NewServeMux(),
	}
}

// CORS対応
func setCorsHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

// GETリクエストを受け取った時の処理
func (r *router) GET(controller controllers.TodoController) {
	r.mux.HandleFunc("/todos", controller.GetAll)
}

// POSTリクエストを受け取った時の処理
func (r *router) POST(controller controllers.TodoController) {
	r.mux.HandleFunc("/create", controller.Create)
}

// PUTリクエストを受け取った時の処理
func (r *router) PUT(controller controllers.TodoController) {
	r.mux.HandleFunc("/update", controller.Update)
}

// DELETEリクエストを受け取った時の処理
func (r *router) DELETE(controller controllers.TodoController) {
	r.mux.HandleFunc("/delete", controller.Delete)
}

// ルーティングの実行
func (r *router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	setCorsHeaders(w) // CORSヘッダーを設定する関数を呼び出し
	if req.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	r.mux.ServeHTTP(w, req)
}
