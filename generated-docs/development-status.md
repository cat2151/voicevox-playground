Last updated: 2026-03-07

# Development Status

## 現在のIssues
- [Issue #145](../issue-notes/145.md): イントネーションが未修正の場合に、ループ再生時に不要な音声再合成が発生し、待ち時間が発生する。
- [Issue #140](../issue-notes/140.md): ループ再生をONにした状態でPlayボタンを押すと、再生ごとに「イントネーションを適用中…」と表示され、無駄な待ち時間が発生する。
- [Issue #121](../issue-notes/121.md): イントネーション付きお気に入りの設定を、まとめてエクスポートおよびインポートできるようにする機能が必要。

## 次の一手候補
1. [Issue #145](../issue-notes/145.md) 不要な再合成を修正し、キャッシュを利用する
   - 最初の小さな一歩: `src/playback.ts` の `handlePlay()` 関数と `src/intonation/playback.ts` の `playUpdatedIntonation()` 関数を分析し、`intonationDirty` が `false` かつ音声キャッシュが存在する場合に、無条件で再合成を試みるロジックを特定する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `src/playback.ts`, `src/intonation/playback.ts`, `src/intonation/state.ts`

     実行内容: `src/playback.ts` の `handlePlay` 関数と `src/intonation/playback.ts` の `playUpdatedIntonation` 関数について、`intonationDirty` フラグと音声キャッシュの利用ロジックを分析し、イントネーションが未変更（`intonationDirty` が `false`）かつ有効な音声キャッシュが存在する場合に、不要な音声再合成が発生しないように修正してください。キャッシュされた音声があればそれを再生するロジックを優先させてください。

     確認事項: 既存の音声再生フロー、キャッシュ管理 (`AudioCache`)、および `intonationDirty` の状態更新ロジックとの整合性を確認してください。特に、イントネーションが実際に変更された場合のみ再合成がトリガーされることを保証してください。

     期待する出力: 修正された `src/playback.ts` および `src/intonation/playback.ts` のコード、または修正が必要な箇所と具体的な実装提案をMarkdown形式で出力してください。
     ```

2. [Issue #140](../issue-notes/140.md) ループ再生時の無駄な待ち時間を解消する
   - 最初の小さな一歩: `src/playback.ts` 内に、現在のテキスト、スタイルID、およびイントネーション情報（`intonationState.query` など）が前回の音声合成時と同一であるかを効率的に比較するユーティリティ関数またはロジックの追加を検討する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `src/playback.ts`, `src/state.ts`, `src/intonation/state.ts`

     実行内容: `src/playback.ts` の `handlePlay` 関数において、ループ再生が有効な際に、現在のテキスト、スタイルID、およびイントネーション情報が前回の音声合成時と完全に同一であるかを判定するロジックを追加してください。もし同一であると判定された場合、Voicevox APIへの再合成リクエストをスキップし、既存の音声キャッシュ（もしあれば）を再生するパスを実装して、無駄な待ち時間を解消してください。

     確認事項: 音声合成に必要な全ての入力パラメータ（テキスト、スタイル、イントネーションの状態）が正確に比較対象に含まれていることを確認してください。また、キャッシュが存在しない場合やパラメータが変更された場合には、引き続き適切な音声合成処理が実行されることを保証してください。

     期待する出力: 修正された `src/playback.ts` のコード、および関連する状態管理ファイルの変更点（もしあれば）をMarkdown形式で出力してください。
     ```

3. [Issue #120](../issue-notes/120.md) textarea編集時のキーボード操作モードの干渉を修正する
   - 最初の小さな一歩: `src/main.ts` に登録されているキーボードイベントリスナーと `src/uiControls.ts` のキーボード処理ロジックを分析し、現在のフォーカスが `textarea` 要素にあるかどうかを判定する処理を追加する。
   - Agent実行プロンプト:
     ```
     対象ファイル: `src/main.ts`, `src/uiControls.ts`, `src/config.ts`

     実行内容: `src/main.ts` と `src/uiControls.ts` に実装されているキーボードイベントハンドラを修正し、`textarea` 要素がアクティブ（フォーカスを持っている）な状態の場合には、キーボード操作モード特有のショートカットキー（特に `a-z` や `space` キー）が意図しないアクション（例: 再生開始）をトリガーしないように抑制してください。同時に、SHIFT+ENTERとCTRL+ENTERが、フォーカス位置に関わらずPlayキーとして機能するようにロジックを実装してください。

     確認事項: `textarea` のイベントが適切に`preventDefault()`や`stopPropagation()`されることを確認し、他のUI要素やキーボード操作モードの他の機能に悪影響を与えないことを検証してください。SHIFT+ENTERとCTRL+ENTERが安定してPlayアクションをトリトリガーすることを確認してください。

     期待する出力: 修正された `src/main.ts` および `src/uiControls.ts` のコード、または関連するイベントリスナーの設定変更点をMarkdown形式で出力してください。
     ```

---
Generated at: 2026-03-07 07:03:17 JST
