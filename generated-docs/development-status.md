Last updated: 2026-03-03

# Development Status

## 現在のIssues
- [Issue #138](../issue-notes/138.md): セリフtextarea内で区切り文字によるスタイル変更がある場合、イントネーション変更時にスタイルが無効化されユーザーが混乱するため、イントネーション編集を不可にする方針です。
- [Issue #121](../issue-notes/121.md): イントネーション付きお気に入りのエクスポート・インポート機能を追加し、ローカルストレージの内容をまとめて扱えるようにします。
- [Issue #120](../issue-notes/120.md): キーボード操作モードON時にtextarea編集で発生する意図しないキー動作を抑制し、SHIFT+ENTER/CTRL+ENTERを再生キーとして統一することで操作性を改善します。

## 次の一手候補
1. [Issue #138](../issue-notes/138.md) セリフスタイル変更時のイントネーション編集挙動改善
   - 最初の小さな一歩: `src/intonation.ts`または`src/intonationUtils.ts`に、セリフテキスト内にスタイル変更の区切り文字が存在するかを判定する関数を実装し、その判定ロジックを確立する。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/intonation.ts, src/intonationUtils.ts, src/main.ts

     実行内容: `src/main.ts`内のセリフテキスト処理ロジックを分析し、セリフテキストにスタイル変更の区切り文字（例: 「_」や「|」）が含まれているかを判定するユーティリティ関数`hasStyleDelimiter(text: string): boolean`を`src/intonationUtils.ts`に実装してください。この関数はブーリアン値を返すべきです。`src/main.ts`において、この関数を使ってセリフテキストのスタイル区切り文字の有無を判定し、イントネーション編集エリアの活性状態を制御するための準備として、この判定結果をどこかの状態変数に格納する、またはログ出力する、といった形で統合案を示してください。

     確認事項: スタイル変更の区切り文字の定義（例: `_` や `|`）を正確に特定し、既存のテキスト解析ロジックと衝突しないことを確認してください。また、将来的にイントネーション編集エリアの表示制御に影響を与える可能性のある`src/intonationDisplay.ts`との関連性も考慮し、影響範囲を最小限に抑えるよう設計してください。

     期待する出力: `src/intonationUtils.ts`に追加される新しいユーティリティ関数のコードと、その関数を`src/main.ts`から呼び出し、判定結果を統合するための変更案をMarkdown形式で提示してください。
     ```

2. [Issue #121](../issue-notes/121.md) イントネーション付きお気に入りのexport/import機能追加
   - 最初の小さな一歩: `src/settings.ts`内でお気に入りデータを`localStorage`から読み込み、JSON文字列としてエクスポートする基本的な関数と、JSON文字列を受け取って`localStorage`に保存するインポート関数を実装する。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/settings.ts, src/uiControls.ts

     実行内容: イントネーション付きお気に入りデータが`localStorage`にどのように保存されているかを`src/settings.ts`内で分析し、そのデータをJSON形式でエクスポートする関数`exportFavorites(): string`と、JSON文字列を受け取って`localStorage`に保存する関数`importFavorites(data: string): void`を`src/settings.ts`に追加してください。これらの関数は、既存のお気に入りデータ管理ロジック（例: `saveFavorites`, `loadFavorites`など）と連携し、複数のお気に入りをまとめて扱えるように設計してください。

     確認事項: 既存のお気に入り機能が使用している`localStorage`キーとデータ構造を正確に特定し、他の設定と競合しないことを確認してください。エクスポートされるJSONの形式が、インポート時に適切に再構築できるものであることを確認してください。

     期待する出力: `src/settings.ts`に追加される`exportFavorites`および`importFavorites`関数のコードをMarkdown形式で生成してください。
     ```

3. [Issue #120](../issue-notes/120.md) キーボード操作モードON時のtextarea編集改善
   - 最初の小さな一歩: `src/main.ts`または`src/uiControls.ts`内でキーボードイベントリスナーが設定されている箇所を特定し、textarea要素がフォーカスされている場合に'a'から'z'、スペース、Enterキーのデフォルト動作を阻止する`event.preventDefault()`を追加する。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/main.ts, src/uiControls.ts, src/config.ts

     実行内容: `src/main.ts`や`src/uiControls.ts`内で定義されている主要なキーボードイベントリスナーを分析し、以下の改修案を提示してください。
     1. 現在フォーカスされている要素が`<textarea>`であるかを判定するロジックを組み込みます。
     2. キーボード操作モードがONの場合でも、`<textarea>`がアクティブな際には、'a'から'z'のキー、'Space'キー、'Enter'キーのデフォルト動作（例: テキスト入力や改行）を`event.preventDefault()`で阻止します。
     3. SHIFT+ENTERおよびCTRL+ENTERのキーイベントを再生アクションに統一するためのイベントハンドリングの変更を検討し、具体的なコードスニペットで示してください。

     確認事項: `src/config.ts`で定義されている既存のキーボードショートカットや、他の重要なキーボードイベントハンドラーが意図せず無効化されないことを確認してください。特に、`isKeyboardModeEnabled()`のようなキーボード操作モードの状態判定ロジックが適切に利用されているかを確認してください。

     期待する出力: 既存のキーボードイベント処理に加えるべき変更点を、関連するコードスニペットと説明を加えてMarkdown形式で記述してください。

---
Generated at: 2026-03-03 07:04:49 JST
