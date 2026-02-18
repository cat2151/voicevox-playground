Last updated: 2026-02-19

# Development Status

## 現在のIssues
- [Issue #122](../issue-notes/122.md)では、VOICEVOXサーバー未起動時に表示される「Failed to fetch」エラーを、より分かりやすい「ローカルVOICEVOXサーバーを起動してください」というダイアログ表示に改善する案が検討されています。
- [Issue #121](../issue-notes/121.md)では、「イントネーション付きお気に入り」のローカルストレージ内容を複数まるごとエクスポート・インポートする機能の追加が計画されており、UX検証を目的としています。
- [Issue #119](../issue-notes/119.md)では、キャラやスタイル選択時、およびランダムスタイルチェックボックス選択時に自動再生を行う機能、とループ再生中のお気に入り再生の挙動を修正する機能の追加が求められています。

## 次の一手候補
1.  [Issue #122](../issue-notes/122.md) 「エラーが発生しました: Failed to fetch」メッセージの改善
    -   最初の小さな一歩: `src/main.ts`または`src/status.ts`内でVOICEVOX API呼び出しのエラーハンドリング部分を特定し、`Failed to fetch`エラー時にコンソールに「ローカルVOICEVOXサーバーを起動してください」というメッセージを出力する処理を追加する。
    -   Agent実行プロンプト:
        ```
        対象ファイル: `src/main.ts`, `src/status.ts`

        実行内容: `src/main.ts`または`src/status.ts`において、VOICEVOXのスタイル情報取得API呼び出し（例: `/speakers`エンドポイント）が行われている箇所を特定してください。このAPI呼び出しが失敗し、特に`Failed to fetch`エラーが発生した場合に、ユーザーにVOICEVOXローカルサーバーの起動を促すメッセージ（例: 「ローカルVOICEVOXサーバーを起動してください」）を一時的にコンソールに出力する処理を追加してください。既存のUIへの影響がないよう、まずはコンソール出力に留めてください。

        確認事項: VOICEVOX API呼び出しが実際に行われている場所を正確に特定できるか。エラーハンドリングの既存ロジックと競合しないか。メッセージ表示が開発者向けであり、UI変更を伴わないことを確認してください。

        期待する出力: 指定されたファイルへのコード変更（TypeScript）と、変更内容の説明をmarkdown形式で出力してください。
        ```

2.  [Issue #121](../issue-notes/121.md) イントネーション付きお気に入りのエクスポート・インポート機能の追加
    -   最初の小さな一歩: `index.html`にexportボタンとimportボタンのHTML要素を追加し、`src/uiControls.ts`でこれらのボタンにクリックイベントリスナーを登録し、クリック時にコンソールにそれぞれ「Export clicked」および「Import clicked」とログを出力する処理を実装する。同時に、お気に入りデータがローカルストレージに保存される`src/intonationState.ts`などの既存処理を分析し、その概要をmarkdownでまとめる。
    -   Agent実行プロンプト:
        ```
        対象ファイル: `index.html`, `src/uiControls.ts`, `src/intonationState.ts`

        実行内容:
        1. `index.html`内で「イントネーション付きお気に入り」セクションの見出し近くに、`Export`ボタンと`Import`ボタンのHTML要素を追加してください。
        2. `src/uiControls.ts`において、追加したボタン要素にクリックイベントリスナーを登録し、クリック時にそれぞれ`console.log('Export clicked');`および`console.log('Import clicked');`を出力する処理を実装してください。
        3. `src/intonationState.ts`などの関連ファイルから、お気に入りデータがローカルストレージにどのように保存・読み込まれているかを分析し、その処理の概要をmarkdownでまとめてください。

        確認事項: 既存のUIレイアウトを大きく崩さないこと。ローカルストレージへのアクセス方法やデータの構造（複数まるごと）を正確に把握できるか。

        期待する出力: `index.html`と`src/uiControls.ts`へのコード変更（HTML, TypeScript）と、`src/intonationState.ts`のお気に入りデータ管理に関する分析結果をmarkdown形式で出力してください。
        ```

3.  [Issue #119](../issue-notes/119.md) キャラ&スタイル選択時の自動再生機能の追加
    -   最初の小さな一歩: `src/uiControls.ts`内で、キャラ&スタイルプルダウン、スタイルプルダウン、ランダムスタイルチェックボックスの変更イベントリスナーを特定し、イベント発火時に`console.log('Auto-play triggered by style change');`を出力するようにする。加えて、`src/playback.ts`または関連する再生制御ロジックを分析し、お気に入り再生時（`playFavorite`関数など）にループ再生を停止するロジック（`stop`関数呼び出しなど）を追加する可能性のある箇所を特定し、その概要をmarkdownでまとめる。
    -   Agent実行プロンプト:
        ```
        対象ファイル: `src/uiControls.ts`, `src/playback.ts`, `src/state.ts`

        実行内容:
        1. `src/uiControls.ts`において、キャラ&スタイルプルダウン、スタイルプルダウン、ランダムスタイルチェックボックスの`change`イベントリスナー（またはそれに相当するイベントハンドリング箇所）を特定してください。これらのイベントが発生した際に、`console.log('Auto-play triggered by style change');`を出力する処理を追加してください。
        2. `src/playback.ts`または関連する再生制御ロジックを分析し、お気に入り再生（`playFavorite`関数など）が呼ばれた際に、もしループ再生中（`loopPlayback`関数など）であれば、そのループ再生を停止する（`stop`関数を呼び出すなど）ロジックを追加する可能性のある箇所を特定し、その概要をmarkdownでまとめてください。

        確認事項: 既存の再生ロジックと衝突しないか。自動再生のトリガーが意図しないタイミングで発火しないか。ループ再生の状態管理がどこで行われているか。

        期待する出力: `src/uiControls.ts`へのコード変更（TypeScript）と、お気に入り再生時のループ再生停止ロジックに関する分析結果および変更提案をmarkdown形式で出力してください。

---
Generated at: 2026-02-19 07:06:16 JST
