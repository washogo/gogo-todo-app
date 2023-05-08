# ベースイメージとして公式の Go イメージを使用
FROM golang:1.17

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をコピー
COPY go.mod go.sum ./

# 依存関係をダウンロード
RUN go mod download

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
# RUN go build -o main ./cmd

# ポートをエクスポーズ
EXPOSE 8080

# ビルドしたファイルを実行
# CMD ["./main"]

# アプリケーションを実行
CMD ["go", "run", "./cmd/main.go"]