Last updated: 2026-03-09

# Development Status

## 現在のIssues
- 現在、`src/main.ts`が500行を超え肥大化しており、リファクタリングが推奨されています（[Issue #157](../issue-notes/157.md)）。
- スペクトログラムの表示最適化（[Issue #115](../issue-notes/115.md)）や波形全体表示への推定周波数描画（[Issue #113](../issue-notes/113.md)）は保留中です。
- リアルタイムFFTのリニア・対数表示切り替え機能（[Issue #111](../issue-notes/111.md)）もLLMのハルシネーションにより保留されています。

## 次の一手候補
1. `src/main.ts` の`settings`関連UIロジックを`src/settings.ts`に移動し整理する ([Issue #157](../issue-notes/157.md))
   - 最初の小さな一歩: `src/main.ts` 内の `settingsToggleButton`, `voicevoxPortInput`, `voicevoxNemoPortInput`, `frequencyTopPercentInput`, `settingsResetButton` に関するDOM取得とイベントリスナー設定ロジックを抽出し、`src/settings.ts` に新しい初期化関数 `initializeSettingsUI()` を作成して移動する。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/main.ts, src/settings.ts

     実行内容:
     1. `src/main.ts` から `settingsToggleButton`, `voicevoxPortInput`, `voicevoxNemoPortInput`, `frequencyTopPercentInput`, `settingsResetButton` のDOM取得、イベントリスナー設定、および `applySettingsToInputs` 関数の定義を削除してください。
     2. `src/settings.ts` に新しい関数 `initializeSettingsUI(settingsToggleButton: HTMLButtonElement, settingsPanel: HTMLElement, voicevoxPortInput: HTMLInputElement, voicevoxNemoPortInput: HTMLInputElement, frequencyTopPercentInput: HTMLInputElement, settingsResetButton: HTMLButtonElement)` を定義し、削除したロジックを移動してください。
     3. `initializeSettingsUI` 関数内で `loadSettings` と `getCurrentSettings` を利用するようにし、`refreshStylesAfterPortChange` 関数は `initializeSettingsUI` の内部で適切に呼び出すか、必要に応じて `playback.ts` や `styleManager.ts` などから公開されている関数を利用するように修正してください。
     4. `src/main.ts` から `initializeSettingsUI` を呼び出すように変更してください。

     確認事項:
     - 既存のUI機能が正しく動作すること（設定パネルの表示/非表示、ポート設定の変更と反映、周波数設定の変更、設定のリセット）を確認してください。
     - `voicevoxPort` や `voicevoxNemoPort` の変更が `fetchVoiceStyles` に適切に伝播し、スタイルが再ロードされることを確認してください。
     - `settings.ts` は既に設定値の保存/ロードを担っているため、UI関連のロジックが追加されても責務の範囲内であることを確認してください。

     期待する出力: `src/main.ts` から設定UI関連のロジックが削減され、`src/settings.ts` にそれらのロジックが追加されたTypeScriptコード。リファクタリング前後の差分説明をMarkdown形式で出力してください。
     ```

2. `src/main.ts` の`usagePanel`関連UIロジックを`src/uiControls.ts`に移動する ([Issue #157](../issue-notes/157.md))
   - 最初の小さな一歩: `src/main.ts` 内の `usageToggleButton` と `usagePanel` に関するDOM取得とイベントリスナー設定ロジックを抽出し、`src/uiControls.ts` に新しい初期化関数 `initializeUsageUI()` を作成して移動する。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/main.ts, src/uiControls.ts

     実行内容:
     1. `src/main.ts` から `usageToggleButton` と `usagePanel` のDOM取得とイベントリスナー設定ロジックを削除してください。
     2. `src/uiControls.ts` に新しい関数 `initializeUsageUI(usageToggleButton: HTMLButtonElement, usagePanel: HTMLElement)` を定義し、削除したロジックを移動してください。
     3. `src/main.ts` から `initializeUsageUI` を呼び出すように変更してください。

     確認事項:
     - `usagePanel` の表示/非表示トグル機能が正しく動作することを確認してください。
     - `uiControls.ts` にUI関連のロジックを集中させることで、単一責任の原則が促進されることを確認してください。

     期待する出力: `src/main.ts` から `usagePanel` 関連のロジックが削減され、`src/uiControls.ts` にそれらのロジックが追加されたTypeScriptコード。リファクタリング前後の差分説明をMarkdown形式で出力してください。
     ```

3. `src/main.ts` の`favoritesPanel`関連UIロジックを`src/uiControls.ts`に移動する ([Issue #157](../issue-notes/157.md))
   - 最初の小さな一歩: `src/main.ts` 内の `favoritesToggleButton` と `favoritesPanel` に関するDOM取得とイベントリスナー設定ロジックを抽出し、`src/uiControls.ts` に新しい初期化関数 `initializeFavoritesUI()` を作成して移動する。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/main.ts, src/uiControls.ts

     実行内容:
     1. `src/main.ts` から `favoritesToggleButton` と `favoritesPanel` のDOM取得とイベントリスナー設定ロジックを削除してください。
     2. `src/uiControls.ts` に新しい関数 `initializeFavoritesUI(favoritesToggleButton: HTMLButtonElement, favoritesPanel: HTMLElement)` を定義し、削除したロジックを移動してください。
     3. `src/main.ts` から `initializeFavoritesUI` を呼び出すように変更してください。

     確認事項:
     - `favoritesPanel` の表示/非表示トグル機能が正しく動作することを確認してください。
     - `uiControls.ts` にUI関連のロジックを集中させることで、単一責任の原則が促進されることを確認してください。

     期待する出力: `src/main.ts` から `favoritesPanel` 関連のロジックが削減され、`src/uiControls.ts` にそれらのロジックが追加されたTypeScriptコード。リファクタリング前後の差分説明をMarkdown形式で出力してください。
     ```

---
Generated at: 2026-03-09 07:01:38 JST
