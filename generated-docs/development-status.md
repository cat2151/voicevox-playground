Last updated: 2026-02-13

# Development Status

## 現在のIssues
- [Issue #56](../issue-notes/56.md)と[Issue #57](../issue-notes/57.md)で報告された波形・スペクトログラム表示のバグ修正、およびお気に入り管理欄の機能回復が喫緊の課題です。
- イントネーション編集の操作性（[Issue #50](../issue-notes/50.md), [Issue #45](../issue-notes/45.md)）とダークモードでの視認性（[Issue #44](../issue-notes/44.md)）に関する改善要望があります。
- また、[Issue #58](../issue-notes/58.md)では主要ファイルの肥大化が指摘されており、コード品質向上のためのリファクタリングも検討が必要です。

## 次の一手候補
1. [Issue #56](../issue-notes/56.md) 波形表示のバグ修正：FFT推定周波数の折れ線グラフ描画とリアルタイム波形表示の復旧
   - 最初の小さな一歩: `src/visualization.ts`内で、`drawRenderedWaveform`関数が推定周波数を点で描画している箇所を折れ線グラフに変更し、`drawRealtimeWaveform`関数が何も表示しない問題を修正します。
   - Agent実行プロンプ:
     ```
     対象ファイル: src/visualization.ts

     実行内容:
     src/visualization.ts内の`drawRenderedWaveform`関数において、`frequencies`配列を用いてFFT推定周波数を折れ線グラフとして描画するように修正してください。現在は`ctx.fillRect(x - 1, y - 1, 2, 2);`で点として描画されていますが、これを`ctx.beginPath(); ctx.moveTo(...)`から始まる折れ線グラフの描画に置き換えます。また、`drawRealtimeWaveform`関数が現在何も表示していない問題を修正し、適切な波形データが表示されるようにしてください。

     確認事項:
     - `drawRenderedWaveform`の修正が、FFT推定周波数を正確に折れ線グラフとして表現すること。
     - `drawRealtimeWaveform`の修正により、リアルタイム波形が正しく表示されること。
     - 既存の波形描画機能やスペクトログラム機能に影響を与えないこと。
     - `src/intonation.ts`や`src/main.ts`との連携が問題なく動作すること。

     期待する出力:
     修正されたsrc/visualization.tsファイルの内容。
     ```

2. [Issue #56](../issue-notes/56.md) スペクトログラムのバグ修正：キャッシュ再生時の描画問題と色付けの改善
   - 最初の小さな一歩: `src/visualization.ts`の`drawSpectrogram`関数内で、キャッシュ再生時に既存描画を上書きしないようにロジックを調整します。また、`ctx.createLinearGradient`を使用して指定されたグラデーションでスペクトログラムの色付けを実装します。
   - Agent実行プロンプト:
     ```
     対象ファイル: src/visualization.ts, src/main.ts

     実行内容:
     1. `src/visualization.ts`内の`drawSpectrogram`関数を修正し、キャッシュ再生時（`options.preserveSpectrogram`が`true`の場合）に既存のスペクトログラム描画を上書きせず、必要に応じてリセットまたは描画スキップを行うようにします。
     2. `drawSpectrogram`関数の色付けロジックを修正し、「FFT peakの大きい色から弱い色にかけて、滑らかなグラデーションで色をつける」ように実装します。具体的な色の定義（最も強い部分がホワイト、次に強いのがオレンジ、次にレッド、次にブルー、次にブラック（peak 0））を参考に、`ctx.createLinearGradient`を適切に設定し、`ctx.globalAlpha`で強度を表現してください。
     3. `src/main.ts`において、`handlePlay`関数が`options.preserveSpectrogram`を`true`にする条件を調整し、キャッシュされたセグメントがすべて利用された場合にスペクトログラムの既存描画を保持するようにします。

     確認事項:
     - キャッシュ再生時にスペクトログラムが正しく表示され、以前の描画が上書きされないこと。
     - スペクトログラムの色が指定されたグラデーションで表示されること。
     - リアルタイムでない再生時の描画が正しく行われること。
     - `spectrogramNeedsReset`と`lastSpectrogramScale`が正しく機能し、スケール変更時にリセットされること。

     期待する出力:
     修正されたsrc/visualization.tsとsrc/main.tsファイルの内容。
     ```

3. [Issue #51](../issue-notes/51.md) および [Issue #56](../issue-notes/56.md) の一部: お気に入り管理欄の折りたたみ機能の実装
   - 最初の小さな一歩: `index.html`の`favoritesPanel`要素に`hidden`属性をデフォルトで追加し、`src/main.ts`で`favoritesToggleButton`のクリックイベントハンドラを実装し、`favoritesPanel`の`hidden`属性と`favoritesToggleButton`の`aria-expanded`属性をトグルするようにします。
   - Agent実行プロンプト:
     ```
     対象ファイル: index.html, src/main.ts

     実行内容:
     1. `index.html`内の`<div id="favoritesPanel" class="favorites-panel" hidden>`要素に、デフォルトで`hidden`属性を追加してください。
     2. `src/main.ts`内の`favoritesToggleButton`と`favoritesPanel`の初期化処理を確認し、`favoritesToggleButton`のクリックイベントハンドラを修正します。このハンドラは、`favoritesPanel`の`hidden`属性をトグルし、`favoritesToggleButton`の`aria-expanded`属性も同時に更新するように実装してください。

     確認事項:
     - ページロード時にお気に入り管理欄がデフォルトで非表示になっていること。
     - 「★ お気に入り管理」ボタンをクリックすると、お気に入り管理欄が表示/非表示が切り替わること。
     - `aria-expanded`属性が正確にパネルの開閉状態を反映していること。
     - 既存のお気に入り機能や履歴機能に影響を与えないこと。

     期待する出力:
     修正されたindex.htmlとsrc/main.tsファイルの内容。

---
Generated at: 2026-02-13 07:05:33 JST
