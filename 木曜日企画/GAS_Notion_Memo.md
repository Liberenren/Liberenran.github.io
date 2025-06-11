# Google Apps Script (GAS) メモ

## 重要な関数

### 1. doPost(e)
- Webアプリケーションとして公開した際に、POSTリクエストを受け取る関数
- フォームからのデータ送信時に使用
- パラメータは `e.parameter` で取得可能

### 2. doGet(e)
- Webアプリケーションとして公開した際に、GETリクエストを受け取る関数
- ブラウザで直接アクセスした際に実行される
- APIの動作確認などに使用

### 3. SpreadsheetApp
- スプレッドシートを操作するためのクラス
- 主なメソッド：
  - `openById(id)`: スプレッドシートIDで開く
  - `getSheetByName(name)`: シート名でシートを取得
  - `appendRow(values)`: 行を追加

### 4. ContentService
- レスポンスを返すためのクラス
- 主なメソッド：
  - `createTextOutput(content)`: テキスト出力を作成
  - `setMimeType(type)`: MIMEタイプを設定

## 重要な概念

### 1. スプレッドシートID
- スプレッドシートのURLから取得可能
- 例：`https://docs.google.com/spreadsheets/d/19BXctFx0VW--k5BmatYhzcqbs007-GnUh3ZgESmwY_8/edit`
- この場合、`19BXctFx0VW--k5BmatYhzcqbs007-GnUh3ZgESmwY_8`がID

### 2. デプロイ
- スクリプトをWebアプリケーションとして公開する手順
- 新しいデプロイ → 種類の選択 → Webアプリケーション
- アクセスできるユーザーを設定（全員、組織内、自分）

### 3. エラーハンドリング
- try-catch構文を使用
- エラー発生時は適切なエラーメッセージを返す
- クライアント側でエラーを適切に処理

## セキュリティ注意点

1. スプレッドシートIDは公開しない
2. 適切なアクセス権限を設定
3. 入力値のバリデーションを行う
4. エラーメッセージに機密情報を含めない

## デバッグ方法

1. ログの確認
   - `Logger.log()`でログを出力
   - 実行 → ログを表示で確認

2. エラーの確認
   - 実行 → エラーを表示
   - スタックトレースを確認

## 参考リンク

- [Google Apps Script 公式ドキュメント](https://developers.google.com/apps-script)
- [SpreadsheetApp リファレンス](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)
- [ContentService リファレンス](https://developers.google.com/apps-script/reference/content/content-service)

## フロントエンド（JavaScript）の非同期処理

### 1. 非同期処理の基本概念
- 非同期処理とは、処理が完了するのを待たずに次の処理に進む方式
- 例：データの送信、ファイルの読み込み、APIの呼び出しなど
- ユーザーインターフェースのブロッキングを防ぐために重要

### 2. 主要な非同期処理の方法

#### Promise
- 非同期処理の結果を表すオブジェクト
- 3つの状態：
  - pending（処理中）
  - fulfilled（成功）
  - rejected（失敗）

#### async/await
- Promiseをより簡単に扱うための構文
- `async`関数内で`await`を使用
- コードが同期的に書けるように見える

#### fetch
- ネットワークリクエストを送信するためのAPI
- Promiseを返す
- 主な使用方法：
  ```javascript
  async function fetchData() {
    try {
      const response = await fetch('URL');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('エラー:', error);
    }
  }
  ```

### 3. エラーハンドリング
- try-catch構文を使用
- 非同期処理のエラーを適切に捕捉
- ユーザーへのフィードバックを提供

### 4. 実践的な例
```javascript
// データ送信の例
async function submitData(formData) {
  try {
    // データの準備
    const params = new URLSearchParams();
    for (const key in formData) {
      params.append(key, formData[key]);
    }

    // データの送信
    const response = await fetch('送信先URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    // レスポンスの処理
    if (!response.ok) {
      throw new Error('送信に失敗しました');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
}
```

### 5. 非同期処理の考え方
1. **処理の流れを理解する**
   - どの処理が非同期で必要か
   - どの順序で処理を実行するか
   - エラーが発生した場合の対応

2. **ユーザー体験を考慮**
   - ローディング表示の追加
   - エラーメッセージの表示
   - 処理中のUIブロッキング防止

3. **コードの構造化**
   - 関連する処理を関数にまとめる
   - エラーハンドリングを適切に実装
   - コードの可読性を維持

### 6. デバッグのコツ
- `console.log()`で処理の流れを確認
- ブラウザの開発者ツールでネットワークリクエストを監視
- エラーメッセージを詳細に確認 

   1. ユーザーが送信ボタンをクリック
   2. フォームデータを収集
   3. データを送信（非同期）
   4. 送信完了を待つ
   5. 結果に応じて処理

## GASのレスポンス処理とCORS

### 1. 基本的なレスポンス処理
```javascript
return ContentService.createTextOutput(JSON.stringify({ 
  status: "success",
  message: "データが正常に保存されました"
}))
.setMimeType(ContentService.MimeType.JSON);
```
- このコードは、JSON形式のレスポンスを返す標準的な方法
- `ContentService.createTextOutput()`でテキスト出力を作成
- `JSON.stringify()`でオブジェクトをJSON文字列に変換
- `setMimeType()`でJSON形式であることを指定

### 2. CORSが正常に動作する条件
1. **デプロイ設定が正しいこと**
   - Webアプリケーションとしてデプロイ
   - アクセス権限が適切に設定されている
   - デプロイ時の設定：
     ```
     1. 新しいデプロイ
     2. 種類の選択：Webアプリケーション
     3. 次のユーザーとして実行：自分
     4. アクセスできるユーザー：全員
     ```

2. **URLの使用が正しいこと**
   - デプロイ後に生成されるURLを使用
   - 例：`https://script.google.com/macros/s/.../exec`
   - 開発用URL（`/dev`）ではなく、本番用URL（`/exec`）を使用

3. **エラーハンドリングが適切であること**
   - try-catch構文でエラーを捕捉
   - エラー時も適切なJSONレスポンスを返す
   ```javascript
   try {
     // 処理
     return ContentService.createTextOutput(JSON.stringify({ 
       status: "success",
       message: "成功"
     })).setMimeType(ContentService.MimeType.JSON);
   } catch (error) {
     return ContentService.createTextOutput(JSON.stringify({ 
       status: "error",
       message: error.toString()
     })).setMimeType(ContentService.MimeType.JSON);
   }
   ```

### 3. トラブルシューティング
- CORSエラーが発生する場合の確認ポイント：
  1. デプロイ設定が正しいか
  2. 正しいURLを使用しているか
  3. レスポンスの形式が正しいか
  4. エラーハンドリングが適切か

### 4. ベストプラクティス
1. **レスポンスの一貫性**
   - 成功時もエラー時も同じ形式のJSONを返す
   - 必ず`status`フィールドを含める
   - 適切なメッセージを提供

2. **エラーハンドリング**
   - 具体的なエラーメッセージを返す
   - 機密情報を含めない
   - 適切なHTTPステータスコードを設定

3. **デプロイ管理**
   - 本番環境と開発環境を分ける
   - バージョン管理を行う
   - アクセス権限を適切に設定

## CORSエラーの解決手順と非同期処理

### 1. CORSエラー解決の順序
1. **デプロイ設定の確認**
   - Webアプリケーションとしてデプロイされているか
   - アクセス権限が「全員」に設定されているか
   - 新しいデプロイを作成し直してみる

2. **URLの確認**
   - 正しいデプロイURLを使用しているか
   - `/dev`ではなく`/exec`を使用しているか
   - URLが正しくコピーされているか

3. **コードの確認**
   - レスポンス形式が正しいか
   - エラーハンドリングが適切か
   - MIMEタイプが正しく設定されているか

4. **ブラウザの確認**
   - 開発者ツールでネットワークタブを確認
   - エラーメッセージの詳細を確認
   - キャッシュをクリアしてみる

### 2. submitToGASの使用方法
```javascript
async function submitToGAS(answers) {
  const params = new URLSearchParams();
  for (const key in answers) {
    params.append(key, answers[key]);
  }

  try {
    const response = await fetch('GASのURL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error('送信に失敗しました');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
}
```

### 3. async/awaitの説明
- **asyncとは**
  - 非同期処理を行う関数を宣言するキーワード
  - 関数内で`await`を使用できる
  - Promiseを返す関数を同期的に書けるようにする

- **awaitとは**
  - Promiseの完了を待つキーワード
  - 非同期処理の結果を取得
  - エラーハンドリングが容易

- **使用例**
  ```javascript
  // 非同期処理の例
  async function example() {
    try {
      // データの送信を待つ
      const response = await fetch('URL');
      // レスポンスの処理を待つ
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('エラー:', error);
    }
  }
  ```

### 4. データ送信の流れ
1. フォームデータの収集
2. submitToGAS関数の呼び出し
3. データの送信（非同期）
4. レスポンスの待機
5. 結果の処理

### 5. エラーハンドリングのベストプラクティス
1. **try-catchの使用**
   - 非同期処理のエラーを捕捉
   - 適切なエラーメッセージを表示
   - ユーザーへのフィードバックを提供

2. **エラーメッセージの管理**
   - 具体的なエラー内容を表示
   - ユーザーが理解しやすい表現を使用
   - デバッグに役立つ情報を含める

3. **リトライ処理**
   - 一時的なエラーの場合にリトライ
   - 適切な待機時間を設定
   - 最大リトライ回数を設定