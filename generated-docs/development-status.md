Last updated: 2026-03-02

# Development Status

## 現在のIssues
- `src/main.ts`ファイルが500行を超過しており、リファクタリングの検討が推奨されています ([Issue #136](../issue-notes/136.md))。
- イントネーション編集後や再生時に、意図せずイントネーションがリセットされてしまう問題 ([Issue #117](../issue-notes/117.md), [Issue #135](../issue-notes/135.md)) の修正が進行中です。
- キーボード操作モードでのtextarea編集時に発生する意図しない動作 ([Issue #120](../issue-notes/120.md)) や、イントネーション付きお気に入りのエクスポート・インポート機能追加 ([Issue #121](../issue-notes/121.md)) が検討されています。

## 次の一手候補
1. `src/main.ts`の設定関連ロジックを分離し、ファイルサイズを削減する ([Issue #136](../issue-notes/136.md))
   - 最初の小さな一歩: `src/main.ts`内の設定関連のUI要素初期化とイベントリスナー登録部分を`src/settings.ts`へ移動することを検討し、その影響を分析する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `src/main.ts`, `src/settings.ts`

     実行内容: `src/main.ts`から設定関連のUI要素（`settingsToggleButton`, `voicevoxPortInput`など）の初期化とイベントリスナー登録のロジックを抽出し、`src/settings.ts`に移動するための変更計画を立案してください。特に、`applySettingsToInputs`関数および関連する依存関係を考慮してください。

     確認事項: `src/settings.ts`の既存機能との整合性、および移動後の`src/main.ts`からの呼び出し方法を確認してください。既存のテストが影響を受けないかも検証してください。

     期待する出力: 提案される変更内容、新しい関数やメソッドの定義、`src/main.ts`と`src/settings.ts`の具体的な修正箇所を示すmarkdown形式の計画書。
     ```

2. キーボード操作モード時のtextarea編集における意図しない動作を修正する ([Issue #120](../issue-notes/120.md))
   - 最初の小さな一歩: `src/main.ts`と`src/intonationHandlers.ts`において、テキストエリアがフォーカスされている際に、キーボード操作モードの特定のキーイベントを無視し、SHIFT+ENTER/CTRL+ENTERでの再生機能を実装する準備として、現在のキーイベント処理の流れを分析する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `src/main.ts`, `src/intonationHandlers.ts`, `src/playback.ts`

     実行内容: キーボード操作モードがONの際に、`textarea`要素がフォーカスされている場合、アルファベットキー(a-z)やSpace/Enterキーがイントネーション操作に影響を与えないようにする変更プランを立案してください。また、SHIFT+ENTERまたはCTRL+ENTERで常に再生がトリガーされるようにする変更プランも含めてください。

     確認事項: `handleIntonationKeyDown`の既存の挙動を破壊しないこと。`textarea`のキーイベントと`window`のキーイベントの優先順位と伝播を明確にしてください。

     期待する出力: キーイベントの処理フロー図と、具体的なコード修正案（どのファイルにどのコードを追加・変更するか）をmarkdown形式で示してください。
     ```

3. イントネーション付きお気に入りのエクスポート機能を実装する ([Issue #121](../issue-notes/121.md))
   - 最初の小さな一歩: イントネーション付きお気に入りのデータを`local storage`から取得し、JSON形式で出力するexport機能のUIとロジックの実装計画を立てる。
   - Agent実行プロンプト:
     ```
     対象ファイル: `src/main.ts`, `src/intonation.ts`, `src/intonationState.ts`, `index.html`

     実行内容: イントネーション付きお気に入りをJSON形式でエクスポートする機能の実装計画を立案してください。具体的には、`index.html`にエクスポートボタンを追加し、`src/main.ts`でそのイベントリスナーを登録、`src/intonation.ts`または`src/intonationState.ts`でお気に入りデータを`localStorage`から取得し、JSON文字列としてファイルに保存するロジックを検討してください。

     確認事項: 既存のお気に入り保存/ロードロジックとの整合性を確保してください。エクスポートされるJSONのデータ形式を明確にしてください。

     期待する出力: `index.html`へのHTML要素追加、`src/main.ts`でのイベントリスナー登録、`src/intonation.ts`または`src/intonationState.ts`での新規関数定義と実装案をmarkdown形式で示してください。

---
Generated at: 2026-03-02 07:01:52 JST
