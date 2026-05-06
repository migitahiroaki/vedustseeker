# vedustseeker

Neverlandのマケプレから、割安なveDUSTロックNFTを見つけるツールです。

## 実行方法

localstack+VSCode Debuggerで動かします。環境変数をセットしたうえで `Run Task: LocalStack Start` したら、テーブルがなければ作ります。

VSCodeのLaunchメニューからlocalを実行。デフォで割引ありのみを取るようになっています。

## AWSとの統合

サブモジュールとして、CDKのNodejsFunctionでバンドルを想定しています。
API Gatewayと統合することで、フロントエンドやEventBridge Schedulerから叩けます。

通知機能は含めてないので、ログをサブスクリプションフィルタでとればよいです
