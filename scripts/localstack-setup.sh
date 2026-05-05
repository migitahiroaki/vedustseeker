#!/bin/bash

# LocalStackのセットアップとテーブル作成スクリプト

set -e

# スクリプトディレクトリから親ディレクトリ（assets/lambda）に移動
cd "$(dirname "$0")/.."

# .envファイルから環境変数を読み込む
set -a
source .env
set +a

echo "Starting LocalStack..."
localstack start -d

echo "Waiting for LocalStack to be ready..."
max_attempts=60
attempt=0
while [ $attempt -lt $max_attempts ]; do
  if curl -s http://localhost:4566/_localstack/health | grep -q '"services"'; then
    echo "LocalStack is ready."
    break
  fi
  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo "Timeout waiting for LocalStack"
    exit 1
  fi
  sleep 1
done

# テーブルが既に存在するか確認
if aws dynamodb describe-table \
  --table-name "$DYNAMODB_TABLE_NAME" \
  --endpoint-url "$AWS_ENDPOINT_URL_DYNAMODB" \
  --region "$AWS_REGION" \
  ; then
  echo "Table '$DYNAMODB_TABLE_NAME' already exists."
else
  echo "Creating table '$DYNAMODB_TABLE_NAME'..."
  aws dynamodb create-table \
    --table-name "$DYNAMODB_TABLE_NAME" \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url "$AWS_ENDPOINT_URL_DYNAMODB" \
    --region "$AWS_REGION"
  echo "Table created successfully."
fi
