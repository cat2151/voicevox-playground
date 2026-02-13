Last updated: 2026-02-14

# Development Status

## 現在のIssues
- [Issue #76](../issue-notes/76.md) は、`src/intonation.ts`や`src/visualization.ts`など3つの500行を超えるファイルのリファクタリングを検討しています。
- GitHub Actions関連では、[Issue #75](../issue-notes/75.md) と [Issue #74](../issue-notes/74.md) がDeployワークフロー失敗時のissue自動起票機能の導入を検討しています。
- UI/UXの改善として、[Issue #72](../issue-notes/72.md) のイントネーション編集の制約、[Issue #68](../issue-notes/68.md) のランダムスタイル機能、[Issue #67](../issue-notes/67.md) の再生停止、[Issue #66](../issue-notes/66.md) のボタンアイコン、[Issue #64](../issue-notes/64.md) のキーボード操作、[Issue #51](../issue-notes/51.md) のお気に入り管理欄の折りたたみに関する課題がオープン中です。

## 次の一手候補
1. [Issue #76](../issue-notes/76.md): `src/intonation.ts`のリファクタリング箇所の特定
   - 最初の小さな一歩: 最も行数の多い`src/intonation.ts`について、機能ごとの責任範囲を分析し、分割可能なブロックを特定する。
   - Agent実行プロンプ:
     ```
     対象ファイル: `src/intonation.ts`

     実行内容: `src/intonation.ts`のコードを分析し、機能ごとの責任範囲を明確化し、リファクタリングによってファイルを分割または機能ブロックを抽出できる箇所を特定してください。特に以下の観点に注目してください:
     1. 初期化処理 (`initializeIntonationElements`, `initializeIntonationCanvas`)
     2. データ管理 (`IntonationPoint`, `AudioQuery`関連の操作、お気に入り機能)
     3. UI描画ロジック (`drawIntonationChart`, `renderIntonationLabels`)
     4. イベントハンドリング (`handleIntonationPointerDown`, `handleIntonationKeyDown`など)
     5. オーディオ再生関連 (`playUpdatedIntonation`, `fetchAndRenderIntonation`)
     分析結果をmarkdown形式で出力してください。

     確認事項: ファイル分割の際、依存関係が複雑になる可能性があるので、既存の機能が壊れないように注意深く分析してください。特に`appState`や他のモジュールとの連携を確認してください。

     期待する出力: `src/intonation.ts`を複数の小さなモジュールに分割するための提案リストをmarkdown形式で出力してください。各モジュールについて、その目的、担当する機能、依存関係、および提案されるファイル名を記述してください。
     ```

2. [Issue #75](../issue-notes/75.md) および [Issue #74](../issue-notes/74.md): Deployワークフロー失敗時のissue自動起票連携の確認
   - 最初の小さな一歩: 既存の`.github/workflows/create-issue-on-actions-failure.yml`がGitHub Pagesへのデプロイワークフロー（`.github/workflows/deploy.yml`）の失敗を正しく検知し、issueを起票するように設定されているか確認する。
   - Agent実行プロンプ:
     ```
     対象ファイル: `.github/workflows/deploy.yml`, `.github/workflows/create-issue-on-actions-failure.yml`

     実行内容: `deploy.yml`が失敗した際に`create-issue-on-actions-failure.yml`がトリガーされる設定になっているか確認してください。特に`workflow_run`イベントの`workflows`と`types`の設定が適切か、また失敗したワークフローの情報をissueに適切に含めるための設定（例: `github.event.workflow_run`の利用）が考慮されているか分析してください。

     確認事項: `create-issue-on-actions-failure.yml`がGitHub APIを呼び出すための権限（`permissions`）が適切に設定されているか確認してください。また、issueの重複作成を防ぐためのロジック（`search_for_existing_issue`）が正しく機能するかどうかも確認が必要です。

     期待する出力: `deploy.yml`の失敗時に`create-issue-on-actions-failure.yml`が正しく動作するための現状の課題点と改善提案をmarkdown形式で出力してください。特に、トリガー条件、権限、issue内容のカスタマイズに関する具体的なコード変更案を含めてください。
     ```

3. [Issue #72](../issue-notes/72.md): イントネーション編集のmin/max制約修正のためのロジック分析
   - 最初の小さな一歩: `src/intonation.ts`内のピッチ範囲計算および調整ロジック（`calculateDisplayRange`, `clampPitchToDisplayRange`, `applyRangeExtra`, `getMinimumAllowedExtra`, `handleIntonationKeyDown`など）を特定し、現在のmin/max制約がどのように適用されているかを把握する。
   - Agent実行プロンプ:
     ```
     対象ファイル: `src/intonation.ts`

     実行内容: `src/intonation.ts`内の`calculateDisplayRange`, `clampPitchToDisplayRange`, `applyRangeExtra`, `getMinimumAllowedExtra`, `handleIntonationKeyDown`関数を詳細に分析し、[Issue #72](../issue-notes/72.md)で報告されている「minが縮まない」「min/maxを超えて変化できない」問題の原因となっているロジックの箇所を特定してください。特に、`intonationInitialPitchRange`と`intonationRangeExtra`がピッチの調整範囲にどのように影響しているかを調べてください。

     確認事項: ピッチ調整ロジックの変更が、他のイントネーション関連機能（表示、保存、再生など）に予期せぬ影響を与えないか確認が必要です。また、ユーザーが意図しない極端な値にピッチが設定されないよう、適切なガード条件があるかどうかも確認してください。

     期待する出力: 問題の原因となっているコードブロックと、それを修正するための具体的なコード変更案をmarkdown形式で出力してください。変更案には、`intonationInitialPitchRange`に基づく制約を緩和し、ユーザーの操作に応じてピッチ範囲が柔軟に拡張されるようにするロジックを含めてください。

---
Generated at: 2026-02-14 07:06:27 JST
