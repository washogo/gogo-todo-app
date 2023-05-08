package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"

	"github.com/washogo/gogo-todo-app/infrastructure"
	"github.com/washogo/gogo-todo-app/interface/controllers"
	"github.com/washogo/gogo-todo-app/interface/gateway"
	"github.com/washogo/gogo-todo-app/useCases"
)

func main() {
	// MySQLへの接続
	dsn := "myuser:password@tcp(mysql)/mydb?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		panic(err.Error())
	}

	// MySQLへの接続確認
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MySQL")

	// todosテーブルの作成
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS todos (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), description VARCHAR(255))")
	if err != nil {
		panic(err.Error())
	}

	defer db.Close()

	// repository, useCase, controllerの初期化
	todoRepository := gateway.NewTodoRepository(db)
	todoUseCase := useCases.NewTodoUseCase(todoRepository)
	todoController := controllers.NewTodoController(todoUseCase)

	// Routerの初期化
	// 各種ルーティングの設定
	router := infrastructure.NewRouter(todoController)
	router.GET(todoController)
	router.POST(todoController)
	router.PUT(todoController)
	router.DELETE(todoController)

	server := http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	server.ListenAndServe()
}
