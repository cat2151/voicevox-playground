Last updated: 2026-02-15

# Project Overview

## プロジェクト概要
-   VOICEVOXローカルサーバーと連携し、入力されたテキストを音声に変換して再生するWebアプリケーションです。
-   音声のイントネーション（抑揚）を視覚的に編集し、その結果を即座に音声で確認できる機能を提供します。
-   お気に入りのイントネーションや入力履歴を保存でき、音声波形やスペクトログラムによる視覚化も行えます。

## 技術スタック
-   フロントエンド:
    -   **Vite**: 高速な開発サーバーとモダンなビルドプロセスを提供する、次世代のフロントエンドツールです。
    -   **TypeScript**: JavaScriptに静的型付けを導入することで、大規模なアプリケーション開発においてコードの品質と保守性を高めます。
    -   **Tone.js v15**: Web Audio APIを抽象化し、ブラウザ上で高度なオーディオ処理、エフェクト、再生を可能にするJavaScriptライブラリです。
-   音楽・オーディオ:
    -   **Tone.js v15**: Web Audio APIを基盤として、音声の再生、加工、視覚化に利用されます。
    -   **VOICEVOX API**: ローカルで動作するVOICEVOXエンジンと連携し、テキストから高品質な音声データを生成するためのHTTPインターフェースです。
-   開発ツール:
    -   **TypeScript**: 開発時のコードの安全性を高め、エディタの補完機能を強化します。
    -   **Vite**: 高速なモジュール解決とホットリロードを提供し、開発効率を大幅に向上させます。
    -   **JSDOM**: Node.js環境でDOM（Document Object Model）をシミュレートし、ブラウザ環境に依存するフロントエンドコードのテストを可能にします。
-   テスト:
    -   **Vitest**: Viteとの統合に優れ、高速な単体テストおよびコンポーネントテストフレームワークとして利用されています。
    -   **JSDOM**: フロントエンドのテストにおいて、実際のブラウザなしでDOM操作やイベント処理のテストを行うために使用されます。
-   ビルドツール:
    -   **Vite**: プロダクションビルドの最適化（コード分割、アセットの最適化など）を行い、Webアプリケーションの高速なロードを実現します。
-   言語機能:
    -   **TypeScript**: 型アノテーション、インターフェース、ジェネリクスなどの機能により、堅牢で拡張性の高いJavaScriptコードを記述できます。
-   自動化・CI/CD:
    -   **GitHub Actions**: プロジェクトのREADME.md（英語版）が日本語版を元に自動生成されるなど、継続的インテグレーション・デリバリーのワークフローを自動化するために利用されています。
-   開発標準:
    -   **Biome**: コードのフォーマット、リンティング、バンドリングなどの機能を提供し、プロジェクト全体のコード品質と一貫性を自動的に保ちます。

## ファイル階層ツリー
```
📄 .gitignore
📖 AGENTS.md
📄 LICENSE
📖 README.ja.md
📖 README.md
📊 biome.json
📁 generated-docs/
🌐 index.html
📁 issue-notes/
  📖 100.md
  📖 101.md
  📖 102.md
  📖 22.md
  📖 23.md
  📖 24.md
  📖 25.md
  📖 26.md
  📖 27.md
  📖 30.md
  📖 45.md
  📖 56.md
  📖 62.md
  📖 64.md
  📖 65.md
  📖 66.md
  📖 67.md
  📖 68.md
  📖 72.md
  📖 74.md
  📖 79.md
  📖 80.md
  📖 89.md
  📖 92.md
  📖 93.md
  📖 94.md
  📖 95.md
  📖 96.md
  📖 97.md
  📖 98.md
  📖 99.md
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📘 intonation.test.ts
  📘 intonation.ts
  📘 intonationDisplay.ts
  📘 intonationPlayback.ts
  📘 intonationState.ts
  📘 intonationUtils.ts
  📘 main.ts
  📘 playback.test.ts
  📘 playback.ts
  📘 state.ts
  📘 status.ts
  📘 styleManager.test.ts
  📘 styleManager.ts
  📁 styles/
    🎨 base.css
    🎨 intonation.css
  🎨 styles.css
  📘 textLists.test.ts
  📘 textLists.ts
  📘 uiControls.ts
  📁 visualization/
    📘 canvas.ts
    📘 fft.ts
    📘 spectrogram.ts
    📘 timeAxis.ts
    📘 waveform.ts
  📘 visualization.test.ts
  📘 visualization.ts
  📘 vite-env.d.ts
📊 tsconfig.json
📘 vite.config.ts
```

## ファイル詳細説明
-   **`.gitignore`**: Gitがバージョン管理の対象としないファイルやディレクトリを指定します。
-   **`AGENTS.md`**: エージェントに関する情報やガイドラインを記述したドキュメントファイルです。
-   **`LICENSE`**: プロジェクトのソフトウェアライセンス（利用条件）を定義しています。
-   **`README.ja.md`**: プロジェクトの日本語版の概要、セットアップ方法、機能、使い方、開発方法などを説明する主要なドキュメントです。
-   **`README.md`**: プロジェクトの英語版の概要ドキュメントです。`README.ja.md`を元に自動生成されています。
-   **`biome.json`**: コードのフォーマット、リンティング、その他の開発標準に関するBiomeツールの設定を定義するファイルです。
-   **`generated-docs/`**: プロジェクトのドキュメントが自動生成されて格納されるディレクトリです。
-   **`index.html`**: このWebアプリケーションの単一のエントリーポイントとなるHTMLファイルです。アプリケーションのUI構造の骨格を定義し、スクリプトを読み込みます。
-   **`issue-notes/`**: 開発中の課題や検討事項に関するメモが格納されているディレクトリです。（来訪者向けのため、個別のファイル内容は説明を省略します。）
-   **`package-lock.json`**: Node.jsプロジェクトの依存関係ツリーの正確なバージョンと構成を記録し、チーム開発での一貫性を保証します。
-   **`package.json`**: プロジェクトのメタデータ（名前、バージョン、説明など）、依存関係、開発スクリプトなどを定義するファイルです。
-   **`src/`**: アプリケーションの主要なソースコードが格納されているディレクトリです。
    -   **`audio.ts`**: VOICEVOX APIとの連携、音声クエリの取得、音声データの合成、結合、WAV形式へのエンコードなど、オーディオ関連の低レベル処理を扱います。
    -   **`config.ts`**: アプリケーション全体で使用される定数、設定値、APIエンドポイントのURLなどを一元的に管理するファイルです。
    -   **`intonation.test.ts`**: `intonation.ts`で定義されたイントネーション編集機能の単体テストを記述したファイルです。
    -   **`intonation.ts`**: イントネーション（抑揚）編集のコアロジックを実装しています。UI要素の初期化、イベントハンドリング、ピッチデータの適用、お気に入り機能の管理などを担当します。
    -   **`intonationDisplay.ts`**: イントネーションチャートの描画、ピッチの表示範囲計算、ズーム・スクロールイベントの処理など、イントネーションUIの視覚的な部分を管理します。
    -   **`intonationPlayback.ts`**: イントネーション編集後の音声再生、キャッシュ管理、VOICEVOXエンジンへの再合成リクエストなど、イントネーションに特化した再生ロジックを提供します。
    -   **`intonationState.ts`**: イントネーションのタイミング情報など、イントネーション編集に関するアプリケーションの状態を管理するファイルです。
    -   **`intonationUtils.ts`**: イントネーション関連のデータ構造（オーディオクエリ）の検証やクローンなど、汎用的なユーティリティ関数を提供します。
    -   **`main.ts`**: アプリケーションのメインエントリポイントです。UIの初期設定、イベントリスナーの登録、音声スタイルの適用、初期データの読み込みなど、全体の起動と調整を行います。
    -   **`playback.test.ts`**: `playback.ts`で定義された音声再生機能の単体テストを記述したファイルです。
    -   **`playback.ts`**: 音声の再生・停止、ループ制御、ダウンロード、自動再生、再生リクエストの管理など、アプリケーションの音声再生に関する主要なロジックを実装しています。
    -   **`state.ts`**: アプリケーションの全体的なグローバル状態（例: 現在の再生状態など）を管理するファイルです。
    -   **`status.ts`**: アプリケーションのステータスメッセージ（例: "合成中..."）の表示・非表示、色の管理など、UIフィードバックに関するロジックを提供します。
    -   **`styleManager.test.ts`**: `styleManager.ts`で定義されたスタイル管理機能の単体テストを記述したファイルです。
    -   **`styleManager.ts`**: VOICEVOXの音声スタイル（キャラクター）の取得、選択、UIへの反映、テキスト内のスタイル指定（例: `[style:zundamon]`）の解析などを担当します。
    -   **`src/styles/`**: アプリケーションのCSSスタイルシートが格納されているディレクトリです。
        -   **`base.css`**: アプリケーション全体の基本的なレイアウト、フォント、色などのスタイルを定義します。
        -   **`intonation.css`**: イントネーション編集UIに特化したスタイル（チャートの見た目、操作要素など）を定義します。
        -   **`styles.css`**: その他の汎用的なスタイルや、コンポーネント固有のスタイルを定義します。
    -   **`textLists.test.ts`**: `textLists.ts`で定義されたテキストリスト管理機能の単体テストを記述したファイルです。
    -   **`textLists.ts`**: ユーザーが入力したテキストの履歴管理、お気に入りリストへの保存、表示、永続化（ローカルストレージ）などの機能を提供します。
    -   **`uiControls.ts`**: エクスポートボタンの状態更新など、特定のUIコントロールに関するユーティリティ関数を提供します。
    -   **`src/visualization/`**: 音声の波形やスペクトログラムなどの視覚化に関するコードを格納するディレクトリです。
        -   **`canvas.ts`**: HTML Canvas要素の準備や基本的な描画コンテキストの取得など、Canvas操作に関するユーティリティ関数を提供します。
        -   **`fft.ts`**: 音声信号の周波数分析に用いられる高速フーリエ変換（FFT）アルゴリズムを実装しています。
        -   **`spectrogram.ts`**: 音声の周波数成分の時間変化を示すスペクトログラムの計算、描画、色マッピングなどのロジックを実装しています。
        -   **`timeAxis.ts`**: 音声データの時間軸表示に関するロジック（時間ラベルのフォーマット、目盛りの描画など）を実装しています。
        -   **`waveform.ts`**: 音声信号の振幅変化を示す波形の計算、描画、リアルタイム波形表示などのロジックを実装しています。
    -   **`visualization.test.ts`**: `visualization.ts`で定義された視覚化機能の単体テストを記述したファイルです。
    -   **`visualization.ts`**: 音声波形、スペクトログラム、再生進捗バーなど、音声視覚化機能全体の管理と制御を行います。音声再生と同期して視覚要素を更新します。
    -   **`vite-env.d.ts`**: Vite環境に特有のグローバル型定義や環境変数に関する型情報を記述するファイルです。
-   **`tsconfig.json`**: TypeScriptコンパイラの設定ファイルです。コンパイルオプション（対象ECMAScriptバージョン、モジュール解決方法など）を定義します。
-   **`vite.config.ts`**: Viteのビルドおよび開発サーバーの設定を記述するファイルです。プラグイン、エイリアス、出力オプションなどを定義できます。

## 関数詳細説明
-   **`getAudioQuery(src/audio.ts)`**
    -   役割: VOICEVOX APIから音声合成に必要なオーディオクエリ（テキストに対する音素やピッチの情報）を取得します。
    -   引数: `text: string` (合成するテキスト), `speaker: number` (話者ID)。
    -   戻り値: `Promise<any>` (オーディオクエリのJSONデータ)。
-   **`synthesize(src/audio.ts)`**
    -   役割: 取得したオーディオクエリをVOICEVOX APIに送信し、実際に合成された音声データ（バイナリ）を取得します。
    -   引数: `audioQuery: any` (オーディオクエリデータ), `speaker: number` (話者ID)。
    -   戻り値: `Promise<ArrayBuffer>` (WAV形式などの音声バイナリデータ)。
-   **`combineAudioBuffers(src/audio.ts)`**
    -   役割: 複数のオーディオバッファを一つの連続したオーディオバッファに結合します。
    -   引数: `buffers: AudioBuffer[]` (結合するオーディオバッファの配列)。
    -   戻り値: `AudioBuffer` (結合された新しいオーディオバッファ)。
-   **`encodeAudioBufferToWav(src/audio.ts)`**
    -   役割: Web Audio APIの`AudioBuffer`オブジェクトを標準的なWAVファイル形式のバイナリデータに変換します。
    -   引数: `audioBuffer: AudioBuffer` (エンコードするオーディオバッファ)。
    -   戻り値: `ArrayBuffer` (WAV形式のバイナリデータ)。
-   **`writeString(src/audio.ts)`**
    -   役割: `DataView`オブジェクトに対し、指定されたオフセット位置に文字列をバイトとして書き込みます。主にファイルヘッダの構築などに使用されます。
    -   引数: `view: DataView` (書き込み対象のデータビュー), `offset: number` (書き込み開始オフセット), `string: string` (書き込む文字列)。
    -   戻り値: `void`。
-   **`clamp(src/audio.ts)`**
    -   役割: 数値が指定された最小値と最大値の範囲内に収まるように制限（クランプ）します。
    -   引数: `value: number` (クランプする数値), `min: number` (最小値), `max: number` (最大値)。
    -   戻り値: `number` (クランプ後の数値)。
-   **`dedupeIntonationFavorites(src/intonation.ts)`**
    -   役割: 保存されているお気に入りイントネーションリストから重複する項目を削除し、一意なリストを維持します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`loadIntonationFavorites(src/intonation.ts)`**
    -   役割: ローカルストレージなどから保存されたイントネーションのお気に入りリストを読み込みます。
    -   引数: なし。
    -   戻り値: `IntonationFavorite[]` (お気に入りイントネーションのリスト)。
-   **`persistIntonationFavorites(src/intonation.ts)`**
    -   役割: 現在のイントネーションお気に入りリストをローカルストレージに保存し、永続化します。
    -   引数: `favorites: IntonationFavorite[]` (保存するお気に入りリスト)。
    -   戻り値: `void`。
-   **`disableLoopOnIntonationEdit(src/intonation.ts)`**
    -   役割: イントネーションの編集操作中に、誤って音声がループ再生されるのを防ぐため、ループ設定を無効にします。
    -   引数: なし。
    -   戻り値: `void`。
-   **`resetIntonationState(src/intonation.ts)`**
    -   役割: イントネーションチャートの表示状態、編集履歴、その他の関連する状態を初期値にリセットします。
    -   引数: なし。
    -   戻り値: `void`。
-   **`setStyleChangeHandler(src/intonation.ts)`**
    -   役割: 音声スタイル（キャラクター）が変更された際に実行されるコールバック関数を登録します。
    -   引数: `handler: Function` (スタイル変更時に呼び出される関数)。
    -   戻り値: `void`。
-   **`initializeIntonationElements(src/intonation.ts)`**
    -   役割: イントネーション編集に関連するHTML要素（キャンバス、コントロールボタンなど）をDOMにセットアップし、初期状態に設定します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`isIntonationDirty(src/intonation.ts)`**
    -   役割: 現在のイントネーションデータが、最後に保存された状態や初期状態から変更されているかどうかを判定します。
    -   引数: なし。
    -   戻り値: `boolean` (変更されていれば`true`、そうでなければ`false`)。
-   **`setIntonationKeyboardEnabled(src/intonation.ts)`**
    -   役割: イントネーション編集用のキーボードショートカットの有効/無効を切り替えます。
    -   引数: `enabled: boolean` (キーボード操作を有効にするかどうかのフラグ)。
    -   戻り値: `void`。
-   **`getIntonationKeyboardEnabled(src/intonation.ts)`**
    -   役割: イントネーション編集用のキーボードショートカットが現在有効になっているかどうかを取得します。
    -   引数: なし。
    -   戻り値: `boolean` (有効であれば`true`)。
-   **`applyPitchToQuery(src/intonation.ts)`**
    -   役割: ユーザーが編集したピッチデータをVOICEVOXのオーディオクエリ構造に適用し、更新されたクエリを生成します。
    -   引数: `audioQuery: any` (元のオーディオクエリ), `pitchPoints: { index: number, pitch: number }[]` (新しいピッチポイントの配列)。
    -   戻り値: `any` (ピッチが適用された更新済みオーディオクエリ)。
-   **`applyPitchEdit(src/intonation.ts)`**
    -   役割: ユーザーの操作によって行われた個々のピッチ編集をデータモデルに適用し、関連するUI要素（チャートなど）を更新します。
    -   引数: `index: number` (変更するピッチポイントのインデックス), `newPitch: number` (新しいピッチ値)。
    -   戻り値: `void`。
-   **`handleIntonationPointerDown(src/intonation.ts)`**
    -   役割: イントネーションチャート上でマウスクリックやタッチダウンイベントが発生した際の処理を開始します。主に編集モードへの移行やドラッグ開始点の設定を行います。
    -   引数: `event: PointerEvent` (ポインターイベントオブジェクト)。
    -   戻り値: `void`。
-   **`handleIntonationPointerMove(src/intonation.ts)`**
    -   役割: イントネーションチャート上でポインターが移動した際のイベントを処理します。主にピッチポイントのドラッグによる変更をリアルタイムに反映します。
    -   引数: `event: PointerEvent` (ポインターイベントオブジェクト)。
    -   戻り値: `void`。
-   **`handleIntonationPointerUp(src/intonation.ts)`**
    -   役割: イントネーションチャート上でマウスクリックやタッチアップイベントが終了した際の処理を完了します。編集モードの終了や最終的なピッチ値の適用を行います。
    -   引数: `event: PointerEvent` (ポインターイベントオブジェクト)。
    -   戻り値: `void`。
-   **`handleIntonationKeyDown(src/intonation.ts)`**
    -   役割: イントネーション編集時にキーボードのキーが押された際のイベントを処理します。主にショートカットキーによるピッチ調整や操作を行います。
    -   引数: `event: KeyboardEvent` (キーボードイベントオブジェクト)。
    -   戻り値: `void`。
-   **`renderIntonationFavoritesList(src/intonation.ts)`**
    -   役割: お気に入りとして保存されているイントネーションのリストをUIに表示（レンダリング）します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`removeIntonationFavorite(src/intonation.ts)`**
    -   役割: 指定されたインデックスのお気に入りイントネーションをリストから削除し、ローカルストレージを更新します。
    -   引数: `index: number` (削除するお気に入りのインデックス)。
    -   戻り値: `void`。
-   **`applyIntonationFavorite(src/intonation.ts)`**
    -   役割: 保存されているお気に入りイントネーションデータを現在のテキストに適用し、チャートを更新してそのイントネーションを再現します。
    -   引数: `favorite: IntonationFavorite` (適用するお気に入りイントネーションデータ)。
    -   戻り値: `void`。
-   **`saveCurrentIntonationFavorite(src/intonation.ts)`**
    -   役割: 現在編集中のイントネーション設定を、指定された名前でお気に入りとして保存します。
    -   引数: `name: string` (新しいお気に入りの名前)。
    -   戻り値: `void`。
-   **`refreshIntonationChart(src/intonation.ts)`**
    -   役割: イントネーションデータの変更やUIの状態変化に応じて、イントネーションチャートを最新の状態に再描画します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`getPitchRange(src/intonationDisplay.ts)`**
    -   役割: イントネーションチャートに表示するピッチの最小値と最大値を計算し取得します。
    -   引数: なし。
    -   戻り値: `{ min: number, max: number }` (ピッチの最小値と最大値を含むオブジェクト)。
-   **`calculateBasePadding(src/intonationDisplay.ts)`**
    -   役割: イントネーションチャートの表示領域における基本的なパディング（余白）を計算します。
    -   引数: なし。
    -   戻り値: `{ top: number, bottom: number }` (上下のパディング)。
-   **`getBaseDisplayRange(src/intonationDisplay.ts)`**
    -   役割: イントネーションチャートの初期表示範囲（時間軸）を決定します。
    -   引数: なし。
    -   戻り値: `{ start: number, end: number }` (表示範囲の開始時間と終了時間)。
-   **`calculateDisplayRange(src/intonationDisplay.ts)`**
    -   役割: 現在のズームやスクロールの状態、オーディオの総長に基づいて、イントネーションチャートの実際の表示範囲を計算します。
    -   引数: `currentRange: { start: number, end: number }` (現在の表示範囲), `audioDuration: number` (オーディオの総再生時間)。
    -   戻り値: `{ start: number, end: number }` (計算された表示範囲)。
-   **`clampRangeExtra(src/intonationDisplay.ts)`**
    -   役割: 計算された表示範囲が、全体のオーディオ長や他の制約を超えることがないように調整します。
    -   引数: `range: { start: number, end: number }` (調整する範囲), `totalDuration: number` (全体の時間)。
    -   戻り値: `{ start: number, end: number }` (クランプ後の範囲)。
-   **`applyRangeExtra(src/intonationDisplay.ts)`**
    -   役割: イントネーションチャートの表示範囲に、開始時と終了時の余白を追加で適用します。
    -   引数: `range: { start: number, end: number }` (適用する範囲), `totalDuration: number` (全体の時間)。
    -   戻り値: `{ start: number, end: number }` (余白適用後の範囲)。
-   **`refreshDisplayRange(src/intonationDisplay.ts)`**
    -   役割: UIの変更やデータの更新に応じて、イントネーションチャートの表示範囲を再計算し、更新します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`clampPitchToDisplayRange(src/intonationDisplay.ts)`**
    -   役割: 編集中のピッチ値が、イントネーションチャートの表示可能なピッチ範囲内に収まるように制限します。
    -   引数: `pitch: number` (クランプするピッチ), `displayMinPitch: number` (表示最小ピッチ), `displayMaxPitch: number` (表示最大ピッチ)。
    -   戻り値: `number` (クランプ後のピッチ値)。
-   **`calculateStepSize(src/intonationDisplay.ts)`**
    -   役割: イントネーション編集の際、ピッチの調整における最小ステップサイズ（増減量）を決定します。
    -   引数: なし。
    -   戻り値: `number` (ステップサイズ)。
-   **`calculateLetterKeyAdjustment(src/intonationDisplay.ts)`**
    -   役割: イントネーションキーボード操作におけるピッチの調整量を計算します。
    -   引数: `event: KeyboardEvent` (キーボードイベント)。
    -   戻り値: `number` (調整量)。
-   **`handleIntonationWheel(src/intonationDisplay.ts)`**
    -   役割: マウスホイール操作によるイントネーションチャートのズームやスクロールを処理します。
    -   引数: `event: WheelEvent` (ホイールイベントオブジェクト)。
    -   戻り値: `void`。
-   **`ensureWheelHandler(src/intonationDisplay.ts)`**
    -   役割: 指定されたHTML要素に対して、イントネーションチャートのホイールイベントリスナーが適切に設定されていることを確認します。
    -   引数: `element: HTMLElement` (対象となるHTML要素)。
    -   戻り値: `void`。
-   **`updateInitialRangeFromPoints(src/intonationDisplay.ts)`**
    -   役割: イントネーションデータポイントに基づいて、チャートの初期表示範囲（時間軸）を調整します。
    -   引数: `points: { x: number, y: number }[]` (イントネーションポイントの配列)。
    -   戻り値: `void`。
-   **`initializeIntonationCanvas(src/intonationDisplay.ts)`**
    -   役割: イントネーションチャートを描画するためのHTML Canvas要素をセットアップし、2D描画コンテキストを取得します。
    -   引数: `canvas: HTMLCanvasElement` (対象のCanvas要素)。
    -   戻り値: `CanvasRenderingContext2D` (描画コンテキスト)。
-   **`buildIntonationPointsFromQuery(src/intonationDisplay.ts)`**
    -   役割: VOICEVOXのオーディオクエリデータから、イントネーションチャート描画用のピッチポイントデータを生成します。
    -   引数: `audioQuery: any` (VOICEVOXオーディオクエリデータ)。
    -   戻り値: `{ x: number, y: number }[]` (チャート描画用ピッチポイントの配列)。
-   **`renderIntonationLabels(src/intonationDisplay.ts)`**
    -   役割: イントネーションチャートの軸ラベルや補助線などをキャンバス上に描画します。
    -   引数: `context: CanvasRenderingContext2D` (描画コンテキスト), `options: any` (描画オプション)。
    -   戻り値: `void`。
-   **`drawIntonationChart(src/intonationDisplay.ts)`**
    -   役割: イントネーションデータに基づいて、ピッチカーブや関連する視覚要素をキャンバスに描画します。
    -   引数: `context: CanvasRenderingContext2D` (描画コンテキスト), `points: { x: number, y: number }[]` (描画するピッチポイント), `options: any` (描画オプション)。
    -   戻り値: `void`。
-   **`adjustIntonationScale(src/intonationDisplay.ts)`**
    -   役割: イントネーションチャートの表示スケール（ズームレベル）を調整します。
    -   引数: `scale: number` (新しいスケール値), `center: number` (スケールの中心となる時間)。
    -   戻り値: `void`。
-   **`pitchFromY(src/intonationDisplay.ts)`**
    -   役割: キャンバスのY座標値から、対応するピッチ（周波数）値を計算します。
    -   引数: `y: number` (Y座標), `displayMinPitch: number` (表示最小ピッチ), `displayMaxPitch: number` (表示最大ピッチ), `canvasHeight: number` (キャンバスの高さ)。
    -   戻り値: `number` (計算されたピッチ値)。
-   **`findNearestIntonationPoint(src/intonationDisplay.ts)`**
    -   役割: 指定された座標に最も近いイントネーションデータポイントを特定します。
    -   引数: `x: number` (X座標), `y: number` (Y座標), `points: { x: number, y: number }[]` (検索対象のピッチポイント), `threshold: number` (検索許容範囲)。
    -   戻り値: `{ index: number, point: { x: number, y: number } } | null` (見つかったポイントのインデックスとデータ、見つからなければ`null`)。
-   **`scheduleIntonationPlayback(src/intonationPlayback.ts)`**
    -   役割: イントネーション編集後の音声再生をスケジュールし、必要に応じて音声合成キューに追加します。
    -   引数: `audioQuery: any` (オーディオクエリ), `speaker: number` (話者ID), `cachedAudioBuffer?: AudioBuffer` (キャッシュされた音声データがあれば)。
    -   戻り値: `Promise<void>`。
-   **`replayCachedIntonationAudio(src/intonationPlayback.ts)`**
    -   役割: 既に生成・キャッシュされているイントネーション音声を再生成せずに、直接再生します。
    -   引数: `audioBuffer: AudioBuffer` (再生するオーディオバッファ)。
    -   戻り値: `Promise<void>`。
-   **`playUpdatedIntonation(src/intonationPlayback.ts)`**
    -   役割: ユーザーが編集したイントネーション設定に基づいてVOICEVOXエンジンに音声を合成させ、その結果を再生します。
    -   引数: `audioQuery: any` (更新されたオーディオクエリ), `speaker: number` (話者ID)。
    -   戻り値: `Promise<void>`。
-   **`fetchAndRenderIntonation(src/intonationPlayback.ts)`**
    -   役割: 指定されたテキストとスタイルでVOICEVOXからイントネーションデータを取得し、それをイントネーションチャートに描画します。
    -   引数: `text: string` (テキスト), `speaker: number` (話者ID)。
    -   戻り値: `Promise<void>`。
-   **`resetIntonationToInitial(src/intonationPlayback.ts)`**
    -   役割: イントネーション編集の状態を、テキスト入力後に最初にVOICEVOXから取得した状態にリセットします。
    -   引数: なし。
    -   戻り値: `void`。
-   **`updateIntonationTiming(src/intonationState.ts)`**
    -   役割: イントネーションデータのタイミング情報を更新します。
    -   引数: `newTiming: any` (新しいタイミングデータ)。
    -   戻り値: `void`。
-   **`isValidAudioQueryShape(src/intonationUtils.ts)`**
    -   役割: VOICEVOXオーディオクエリオブジェクトが期待される構造（プロパティの有無など）を持っているか検証します。
    -   引数: `query: any` (検証するオーディオクエリオブジェクト)。
    -   戻り値: `boolean` (有効であれば`true`)。
-   **`cloneAudioQuery(src/intonationUtils.ts)`**
    -   役割: VOICEVOXオーディオクエリオブジェクトを、参照を共有しないディープコピーとして複製します。
    -   引数: `query: any` (クローンするオーディオクエリ)。
    -   戻り値: `any` (クローンされたオーディオクエリ)。
-   **`applyStyleSelection(src/main.ts)`**
    -   役割: ユーザーが選択した音声スタイル（キャラクター）をアプリケーション全体に適用し、関連するUI要素（例: スタイル名表示）を更新します。
    -   引数: `styleId: number` (選択されたスタイルID)。
    -   戻り値: `void`。
-   **`applyRandomStyleSelection(src/main.ts)`**
    -   役割: 利用可能な音声スタイルの中からランダムに一つを選び、それをアプリケーションに適用します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`saveDelimiter(src/main.ts)`**
    -   役割: ユーザーが設定したテキスト区切り文字の設定をローカルストレージに永続化します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`scheduleSaveDelimiter(src/main.ts)`**
    -   役割: 指定された時間後に区切り文字の設定を保存する処理をスケジュールします（例: 入力後の遅延保存）。
    -   引数: `delayMs: number` (保存までの遅延時間（ミリ秒）)。
    -   戻り値: `void`。
-   **`updateSpectrogramScaleLabel(src/main.ts)`**
    -   役割: スペクトログラムの表示スケールを示すUIラベル（例: "Normal", "Wide"）を最新の値に更新します。
    -   引数: `scale: string` (新しいスケール表示テキスト)。
    -   戻り値: `void`。
-   **`updateIntonationKeyboardToggle(src/main.ts)`**
    -   役割: イントネーションキーボード操作の有効/無効を切り替えるUI要素の状態（チェックボックスなど）を更新します。
    -   引数: `enabled: boolean` (キーボードが有効かどうかのフラグ)。
    -   戻り値: `void`。
-   **`setLoopCheckboxElement(src/playback.ts)`**
    -   役割: ループ再生を制御するチェックボックスHTML要素の参照を内部的に設定または更新します。
    -   引数: `element: HTMLInputElement` (ループチェックボックス要素)。
    -   戻り値: `void`。
-   **`setPlayButtonAppearance(src/playback.ts)`**
    -   役割: 音声再生の状態（再生中、一時停止、停止など）に応じて再生ボタンの見た目（アイコン、テキストなど）を更新します。
    -   引数: `isPlaying: boolean` (現在再生中かどうかのフラグ)。
    -   戻り値: `void`。
-   **`isPlayRequestPending(src/playback.ts)`**
    -   役割: 現在、音声合成または再生のリクエストがバックグラウンドで処理を待っている状態かどうかを判定します。
    -   引数: なし。
    -   戻り値: `boolean` (保留中であれば`true`)。
-   **`stopPlaybackAndResetLoop(src/playback.ts)`**
    -   役割: 現在の音声再生を停止し、同時にループ再生の設定も解除します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`getAudioCacheKey(src/playback.ts)`**
    -   役割: 入力テキストと話者IDに基づいて、音声データのキャッシュに使用するユニークなキーを生成します。
    -   引数: `text: string` (テキスト), `speaker: number` (話者ID)。
    -   戻り値: `string` (キャッシュキー)。
-   **`setTextAndPlay(src/playback.ts)`**
    -   役割: テキスト入力エリアにテキストを設定し、そのテキストをVOICEVOXで合成・再生する一連の処理を実行します。
    -   引数: `text: string` (設定するテキスト), `speaker: number` (話者ID)。
    -   戻り値: `Promise<void>`。
-   **`downloadLastAudio(src/playback.ts)`**
    -   役割: 最後に再生された音声データをWAVファイルとしてダウンロードする機能を提供します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`scheduleAutoPlay(src/playback.ts)`**
    -   役割: 特定の条件（例: アプリケーション起動時、テキスト変更後）で音声の自動再生をトリガーする処理をスケジュールします。
    -   引数: `text: string` (再生するテキスト), `speaker: number` (話者ID), `delay: number` (自動再生までの遅延時間（ミリ秒）)。
    -   戻り値: `void`。
-   **`confirmResetIntonationBeforePlay(src/playback.ts)`**
    -   役割: イントネーションが編集されている状態で再生を試みた際に、イントネーションのリセットが必要かどうかの確認ダイアログを表示します。
    -   引数: `callback: Function` (ユーザーが確認を了承した場合に実行されるコールバック関数)。
    -   戻り値: `void`。
-   **`handlePlayButtonClick(src/playback.ts)`**
    -   役割: UI上の再生ボタンがクリックされた際のイベントを処理し、音声の再生または一時停止のロジックを呼び出します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`handlePlay(src/playback.ts)`**
    -   役割: 音声再生を開始する主要なロジックを実装しています。テキストの取得、音声合成の開始、再生状態の管理などを含みます。
    -   引数: `initialText: string` (初期テキスト), `initialSpeaker: number` (初期話者ID)。
    -   戻り値: `Promise<void>`。
-   **`triggerPlay(src/playback.ts)`**
    -   役割: プログラム的に音声再生を開始します。UIからの操作ではなく、内部ロジックから再生を制御する場合に使用されます。
    -   引数: `text: string` (再生するテキスト), `speaker: number` (話者ID)。
    -   戻り値: `void`。
-   **`cleanup(src/playback.ts)`**
    -   役割: 再生関連のリソース（タイマー、イベントリスナーなど）を解放し、再生状態をクリアするクリーンアップ処理を実行します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`handleReset(src/playback.ts)`**
    -   役割: テキストエリア、イントネーション、その他のアプリケーションの状態を初期値にリセットする処理を実行します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`handleCancel(src/playback.ts)`**
    -   役割: 現在進行中の音声合成や再生処理を中断し、関連するリソースを解放します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`showStatus(src/status.ts)`**
    -   役割: アプリケーションのステータスメッセージ（例: "合成中..."、"エラー"）をUIに表示します。
    -   引数: `message: string` (表示するメッセージ), `type: 'info' | 'error' = 'info'` (メッセージの種類)。
    -   戻り値: `void`。
-   **`hideStatus(src/status.ts)`**
    -   役割: 現在表示されているステータスメッセージを非表示にします。
    -   引数: なし。
    -   戻り値: `void`。
-   **`scheduleHideStatus(src/status.ts)`**
    -   役割: 指定された時間後にステータスメッセージを自動的に非表示にする処理をスケジュールします。
    -   引数: `delayMs: number` (非表示までの遅延時間（ミリ秒）)。
    -   戻り値: `void`。
-   **`invalidateColorVariableCache(src/status.ts)`**
    -   役割: CSSカスタムプロパティから取得した色の値をキャッシュしている場合、そのキャッシュをクリアし、次回取得時に最新の値を読み込むようにします。
    -   引数: なし。
    -   戻り値: `void`。
-   **`getColorVariable(src/status.ts)`**
    -   役割: CSSカスタムプロパティ（例: `--primary-color`）として定義された色変数の値を取得します。
    -   引数: `name: string` (CSS変数名)。
    -   戻り値: `string` (色の値、例: "#FF0000")。
-   **`getSelectedStyleId(src/styleManager.ts)`**
    -   役割: UIで現在選択されているVOICEVOX音声スタイル（キャラクター）のIDを取得します。
    -   引数: なし。
    -   戻り値: `number` (選択されたスタイルID)。
-   **`setSelectedStyleId(src/styleManager.ts)`**
    -   役割: UI上の音声スタイル選択要素を、指定されたスタイルIDに基づいて更新し、選択状態を設定します。
    -   引数: `styleId: number` (設定するスタイルID)。
    -   戻り値: `void`。
-   **`selectRandomStyleId(src/styleManager.ts)`**
    -   役割: 利用可能な音声スタイルの中からランダムに一つを選び、そのスタイルIDを返します。
    -   引数: なし。
    -   戻り値: `number` (ランダムに選択されたスタイルID)。
-   **`getStyleLabel(src/styleManager.ts)`**
    -   役割: スタイルIDに基づいて、そのスタイルの表示名（ラベル、例: 「ずんだもん」）を取得します。
    -   引数: `styleId: number` (スタイルID)。
    -   戻り値: `string` (スタイルラベル)。
-   **`getStyleById(src/styleManager.ts)`**
    -   役割: 指定されたIDに対応する音声スタイルオブジェクト全体を取得します。
    -   引数: `id: number` (スタイルID)。
    -   戻り値: `StyleObject` (スタイル情報を含むオブジェクト)。
-   **`getSpeakerStylesByStyleId(src/styleManager.ts)`**
    -   役割: 特定のスタイルIDに紐づく話者（キャラクター）の、さらに詳細なスタイル情報（例: 「ノーマル」「ささやき」）を取得します。
    -   引数: `styleId: number` (スタイルID)。
    -   戻り値: `SpeakerStyle[]` (話者スタイルの配列)。
-   **`resolveStyleMarker(src/styleManager.ts)`**
    -   役割: テキスト内に埋め込まれたスタイル指定マーカー（例: `[style:zundamon]`）を解析し、対応するスタイルIDに解決します。
    -   引数: `marker: string` (スタイルマーカー文字列)。
    -   戻り値: `number | null` (解決されたスタイルID、見つからなければ`null`)。
-   **`parseDelimiterConfig(src/styleManager.ts)`**
    -   役割: テキストの自動分割に使用される区切り文字に関する設定文字列（例: "。,、"）を解析し、利用可能な形式に変換します。
    -   引数: `configString: string` (区切り文字設定の文字列)。
    -   戻り値: `DelimiterConfig` (解析された区切り文字設定オブジェクト)。
-   **`addSegment(src/styleManager.ts)`**
    -   役割: 音声合成のためにテキストを分割したセグメントリストに、新しいテキストセグメントを追加します。
    -   引数: `segments: TextSegment[]` (セグメントの配列), `text: string` (追加するテキスト), `styleId: number` (テキストに適用するスタイルID)。
    -   戻り値: `void`。
-   **`buildTextSegments(src/styleManager.ts)`**
    -   役割: 入力テキスト、スタイル指定、区切り文字設定に基づいて、音声合成に適したテキストセグメントのリストを構築します。
    -   引数: `text: string` (元のテキスト), `defaultStyleId: number` (デフォルトのスタイルID), `delimiterConfig: DelimiterConfig` (区切り文字設定)。
    -   戻り値: `TextSegment[]` (構築されたテキストセグメントの配列)。
-   **`populateStyleSelect(src/styleManager.ts)`**
    -   役割: 利用可能な音声スタイル（キャラクター）のリストで、HTMLの`<select>`要素（ドロップダウンリスト）を動的に生成・更新します。
    -   引数: `selectElement: HTMLSelectElement` (対象となる`<select>`要素)。
    -   戻り値: `void`。
-   **`populateSpeakerStyleSelect(src/styleManager.ts)`**
    -   役割: 選択された話者の利用可能なスタイル（例: 「ノーマル」「ささやき」）で、UI要素を更新します。
    -   引数: `selectElement: HTMLSelectElement` (対象となる`<select>`要素), `speakerId: number` (話者ID)。
    -   戻り値: `void`。
-   **`fetchVoiceStyles(src/styleManager.ts)`**
    -   役割: VOICEVOXローカルサーバーから、利用可能なすべての音声スタイル（キャラクター）のリストを取得します。
    -   引数: なし。
    -   戻り値: `Promise<VoiceStyle[]>` (音声スタイル情報の配列)。
-   **`loadStoredList(src/textLists.ts)`**
    -   役割: ローカルストレージから特定のキー（例: "history", "favorites"）に関連付けられたテキストリストを読み込みます。
    -   引数: `key: string` (ストレージキー)。
    -   戻り値: `string[]` (読み込まれたテキストの配列)。
-   **`persistList(src/textLists.ts)`**
    -   役割: 指定されたキーでテキストリストをローカルストレージに保存し、永続化します。
    -   引数: `key: string` (ストレージキー), `list: string[]` (保存するテキストリスト)。
    -   戻り値: `void`。
-   **`persistLists(src/textLists.ts)`**
    -   役割: 履歴とお気に入りなど、複数のテキストリストを一括でローカルストレージに保存します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`dedupeAndLimit(src/textLists.ts)`**
    -   役割: テキストリストから重複するエントリを削除し、指定された最大数にリストの項目数を制限します。
    -   引数: `list: string[]` (処理するリスト), `limit: number` (最大項目数)。
    -   戻り値: `string[]` (処理後のテキストリスト)。
-   **`renderList(src/textLists.ts)`**
    -   役割: テキストリストのデータをHTML要素としてUIに表示（レンダリング）します。
    -   引数: `element: HTMLElement` (表示対象のHTML要素), `list: string[]` (表示するテキストリスト), `type: 'history' | 'favorites'` (リストの種類)。
    -   戻り値: `void`。
-   **`renderTextLists(src/textLists.ts)`**
    -   役割: 履歴とお気に入り両方のテキストリストをUIに描画します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`moveToFavorites(src/textLists.ts)`**
    -   役割: 履歴リストの項目を、お気に入りリストに移動（追加）します。
    -   引数: `text: string` (お気に入りに追加するテキスト)。
    -   戻り値: `void`。
-   **`moveToHistory(src/textLists.ts)`**
    -   役割: お気に入りリストの項目を、履歴リストに移動（追加）します。
    -   引数: `text: string` (履歴に追加するテキスト)。
    -   戻り値: `void`。
-   **`addToHistory(src/textLists.ts)`**
    -   役割: 新しいテキストを履歴リストに追加します。
    -   引数: `text: string` (履歴に追加するテキスト)。
    -   戻り値: `void`。
-   **`initializeTextLists(src/textLists.ts)`**
    -   役割: 履歴やお気に入りリストを初期化し、イベントリスナーを設定し、UIに表示します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`updateExportButtonState(src/uiControls.ts)`**
    -   役割: 音声データのエクスポートが可能かどうかに応じて、エクスポートボタンの有効/無効状態を更新します。
    -   引数: `isEnabled: boolean` (ボタンを有効にするかどうかのフラグ)。
    -   戻り値: `void`。
-   **`prepareCanvas(src/visualization/canvas.ts)`**
    -   役割: 描画用にHTML Canvas要素を初期化し、2Dレンダリングコンテキストを返します。
    -   引数: `canvas: HTMLCanvasElement` (対象のCanvas要素)。
    -   戻り値: `CanvasRenderingContext2D` (描画コンテキスト)。
-   **`getHannWindow(src/visualization/fft.ts)`**
    -   役割: 音声信号処理に用いられるHann窓関数（信号の端を滑らかにするための重み付け関数）を生成します。
    -   引数: `length: number` (窓関数の長さ)。
    -   戻り値: `number[]` (Hann窓関数の係数の配列)。
-   **`fftRadix2(src/visualization/fft.ts)`**
    -   役割: 高速フーリエ変換 (FFT) アルゴリズム（基数2）を実行し、入力信号の周波数スペクトルを計算します。
    -   引数: `buffer: Float32Array` (入力信号のバッファ)。
    -   戻り値: `Float32Array` (周波数成分の配列)。
-   **`lerpColor(src/visualization/spectrogram.ts)`**
    -   役割: 2つの色の間で線形補間を行い、中間の色を生成します。スペクトログラムの色マッピングに使用されます。
    -   引数: `color1: string` (開始色), `color2: string` (終了色), `t: number` (補間係数、0.0～1.0)。
    -   戻り値: `string` (補間された色のHEX値)。
-   **`mapIntensityToSpectrogramColor(src/visualization/spectrogram.ts)`**
    -   役割: 音声スペクトルの強度値に基づいて、スペクトログラム表示用の色を決定します。
    -   引数: `intensity: number` (スペクトル強度), `minIntensity: number` (最小強度), `maxIntensity: number` (最大強度)。
    -   戻り値: `string` (色のHEX値)。
-   **`determineSpectrogramCeiling(src/visualization/spectrogram.ts)`**
    -   役割: スペクトログラム表示のY軸（周波数）の上限値を決定します。
    -   引数: `sampleRate: number` (音声のサンプリングレート)。
    -   戻り値: `number` (上限周波数（Hz）)。
-   **`estimateFundamentalFrequency(src/visualization/spectrogram.ts)`**
    -   役割: 音声信号のスペクトルから基本周波数（ピッチ）を推定します。
    -   引数: `spectrum: Float32Array` (周波数スペクトルデータ), `sampleRate: number` (サンプリングレート)。
    -   戻り値: `number` (推定された基本周波数（Hz）)。
-   **`analyzeSpectrogramFrames(src/visualization/spectrogram.ts)`**
    -   役割: 音声バッファを小さなフレームに分割し、各フレームのスペクトルを分析してスペクトログラムデータを生成します。
    -   引数: `audioBuffer: AudioBuffer` (音声データ), `sampleRate: number` (サンプリングレート), `frameSize: number` (フレームサイズ), `hopSize: number` (ホップサイズ)。
    -   戻り値: `SpectrogramData[]` (各フレームのスペクトログラムデータの配列)。
-   **`drawFrequencyTrack(src/visualization/spectrogram.ts)`**
    -   役割: スペクトログラム上に、推定された基本周波数（ピッチ）の軌跡を描画します。
    -   引数: `context: CanvasRenderingContext2D` (描画コンテキスト), `frequencies: number[]` (周波数系列), `options: any` (描画オプション)。
    -   戻り値: `void`。
-   **`drawSpectrogram(src/visualization/spectrogram.ts)`**
    -   役割: 計算されたスペクトログラムデータをキャンバスに描画します。
    -   引数: `context: CanvasRenderingContext2D` (描画コンテキスト), `spectrogramData: SpectrogramData[]` (スペクトログラムデータ), `options: any` (描画オプション)。
    -   戻り値: `void`。
-   **`drawOfflineSpectrogram(src/visualization/spectrogram.ts)`**
    -   役割: リアルタイムではなく、事前に準備された音声データからスペクトログラムを計算し描画します。
    -   引数: `canvas: HTMLCanvasElement` (対象のCanvas要素), `audioBuffer: AudioBuffer` (音声データ), `options: any` (描画オプション)。
    -   戻り値: `Promise<void>`。
-   **`computeAudioContentHash(src/visualization/spectrogram.ts)`**
    -   役割: 音声コンテンツのハッシュ値を計算し、キャッシュキーなどに利用することで、同じ音声の再計算を防ぎます。
    -   引数: `audioBuffer: AudioBuffer` (音声データ)。
    -   戻り値: `string` (ハッシュ値)。
-   **`buildSpectrogramSignature(src/visualization/spectrogram.ts)`**
    -   役割: スペクトログラムの視覚的な特徴をコンパクトなシグネチャ（識別子）として生成します。
    -   引数: `audioBuffer: AudioBuffer` (音声データ)。
    -   戻り値: `string` (スペクトログラムシグネチャ)。
-   **`processChunk(src/visualization/spectrogram.ts)`**
    -   役割: 音声データの小さなチャンク（断片）を処理し、リアルタイムスペクトログラム更新に利用します。
    -   引数: `audioBuffer: AudioBuffer` (音声データ), `offset: number` (処理開始オフセット)。
    -   戻り値: `void`。
-   **`formatTimeLabel(src/visualization/timeAxis.ts)`**
    -   役割: 秒単位の時間を「MM:SS.ms」のような人間が読みやすい形式にフォーマットします。
    -   引数: `seconds: number` (フォーマットする時間（秒）)。
    -   戻り値: `string` (フォーマットされた時間ラベル)。
-   **`buildTimeTicks(src/visualization/timeAxis.ts)`**
    -   役割: タイムライン表示のための時間目盛りの位置とラベルを計算し、生成します。
    -   引数: `duration: number` (全体の時間), `canvasWidth: number` (キャンバスの幅)。
    -   戻り値: `TimeTick[]` (時間目盛りの情報の配列)。
-   **`drawTimeTicks(src/visualization/timeAxis.ts)`**
    -   役割: 計算された時間目盛りをキャンバスに描画します。
    -   引数: `context: CanvasRenderingContext2D` (描画コンテキスト), `ticks: TimeTick[]` (描画する目盛りデータ), `options: any` (描画オプション)。
    -   戻り値: `void`。
-   **`estimateFrequencySeries(src/visualization/waveform.ts)`**
    -   役割: 音声波形から時間ごとの周波数変化を推定し、周波数系列データを生成します。
    -   引数: `audioBuffer: AudioBuffer` (音声データ), `sampleRate: number` (サンプリングレート), `frameSize: number` (フレームサイズ), `hopSize: number` (ホップサイズ)。
    -   戻り値: `number[]` (推定された周波数系列)。
-   **`computeSegmentStats(src/visualization/waveform.ts)`**
    -   役割: 波形データの一部（セグメント）の統計情報（平均振幅、RMS値など）を計算します。
    -   引数: `buffer: Float32Array` (波形セグメントのデータ)。
    -   戻り値: `SegmentStats` (計算された統計情報オブジェクト)。
-   **`computeSegmentCorrelation(src/visualization/waveform.ts)`**
    -   役割: 2つの波形セグメント間の相関を計算し、それらの類似度を評価します。
    -   引数: `buffer1: Float32Array` (一つ目のバッファ), `buffer2: Float32Array` (二つ目のバッファ)。
    -   戻り値: `number` (相関値)。
-   **`extractAlignedRealtimeSegment(src/visualization/waveform.ts)`**
    -   役割: リアルタイム音声入力から、特定のタイミングで整列された波形セグメントを抽出します。
    -   引数: `audioContext: AudioContext` (Web Audioコンテキスト), `sourceNode: AudioNode` (音声ソースノード), `startTime: number` (開始時間), `duration: number` (期間)。
    -   戻り値: `Float32Array` (抽出された波形セグメント)。
-   **`drawRenderedWaveform(src/visualization/waveform.ts)`**
    -   役割: 事前にレンダリングされた（オフライン処理された）音声データの波形をキャンバスに描画します。
    -   引数: `canvas: HTMLCanvasElement` (対象のCanvas要素), `audioBuffer: AudioBuffer` (音声データ), `options: any` (描画オプション)。
    -   戻り値: `void`。
-   **`drawRealtimeWaveform(src/visualization/waveform.ts)`**
    -   役割: リアルタイムで入力される音声の波形をキャンバスに描画します。
    -   引数: `canvas: HTMLCanvasElement` (対象のCanvas要素), `audioBuffer: AudioBuffer` (音声データ), `currentTime: number` (現在の再生時間), `options: any` (描画オプション)。
    -   戻り値: `void`。
-   **`getSpectrogramScale(src/visualization.ts)`**
    -   役割: スペクトログラムの表示スケール設定（例: 'normal', 'wide'）を取得します。
    -   引数: なし。
    -   戻り値: `string` (現在のスペクトログラムスケール)。
-   **`setSpectrogramScale(src/visualization.ts)`**
    -   役割: スペクトログラムの表示スケールを変更し、UI表示を更新します。
    -   引数: `scale: string` (設定するスケール)。
    -   戻り値: `void`。
-   **`requestSpectrogramReset(src/visualization.ts)`**
    -   役割: スペクトログラム表示をリセットし、再描画を要求します。主に新しい音声がロードされた際に使用されます。
    -   引数: なし。
    -   戻り値: `void`。
-   **`isPlaybackActive(src/visualization.ts)`**
    -   役割: 現在音声が再生中であるかどうかを判定します。
    -   引数: なし。
    -   戻り値: `boolean` (再生中であれば`true`)。
-   **`stopActivePlayback(src/visualization.ts)`**
    -   役割: 現在進行中の音声再生を停止します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`initializeVisualizationCanvases(src/visualization.ts)`**
    -   役割: 音声波形やスペクトログラムを描画するためのCanvas要素をセットアップし、初期化します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`playAudio(src/visualization.ts)`**
    -   役割: 音声バッファを再生し、同時に視覚化（波形、スペクトログラム、再生進捗）を開始します。
    -   引数: `audioBuffer: AudioBuffer` (再生する音声データ)。
    -   戻り値: `Promise<void>`。
-   **`setProgressPosition(src/visualization.ts)`**
    -   役割: 再生進捗バーまたはラインの表示位置を更新します。
    -   引数: `position: number` (進捗割合、0.0～1.0)。
    -   戻り値: `void`。
-   **`updateProgressLines(src/visualization.ts)`**
    -   役割: 音声再生の進捗を示す視覚的なラインを、現在の再生時間と全体の再生時間に基づいて更新します。
    -   引数: `currentTime: number` (現在の再生時間), `duration: number` (全体の再生時間)。
    -   戻り値: `void`。
-   **`clearProgressLines(src/visualization.ts)`**
    -   役割: 音声再生の進捗ラインをクリアし、非表示にします。
    -   引数: なし。
    -   戻り値: `void`。
-   **`requestSpectrogramDraw(src/visualization.ts)`**
    -   役割: スペクトログラムの再描画をトリガーします。
    -   引数: なし。
    -   戻り値: `void`。
-   **`render(src/visualization.ts)`**
    -   役割: 全ての視覚化要素（波形、スペクトログラム、タイムラインなど）を更新・描画するメインのループまたはイベント駆動関数です。
    -   引数: なし。
    -   戻り値: `void`。
-   **`cleanup(src/visualization.ts)`**
    -   役割: 視覚化関連のリソース（アニメーションフレーム、イベントリスナーなど）を解放し、状態をクリアするクリーンアップ処理を実行します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`finalize(src/visualization.ts)`**
    -   役割: 視覚化プロセスの最終処理を実行し、全てのリソースを適切に解放します。
    -   引数: なし。
    -   戻り値: `void`。
-   **`stopPlayback(src/visualization.ts)`**
    -   役割: 視覚化と連携して音声再生を停止します。
    -   引数: なし。
    -   戻り値: `void`。

## 関数呼び出し階層ツリー
```
- if (src/audio.ts)
  - getAudioQuery (src/audio.ts)
    - synthesize ()
      - combineAudioBuffers ()
      - encodeAudioBufferToWav ()
      - writeString ()
      - clamp ()
  - dedupeIntonationFavorites (src/intonation.ts)
    - loadIntonationFavorites ()
      - persistIntonationFavorites ()
      - disableLoopOnIntonationEdit ()
      - resetIntonationState ()
      - setStyleChangeHandler ()
      - initializeIntonationElements ()
      - isIntonationDirty ()
      - setIntonationKeyboardEnabled ()
      - getIntonationKeyboardEnabled ()
      - applyPitchToQuery ()
      - applyPitchEdit ()
      - handleIntonationPointerDown ()
      - handleIntonationPointerMove ()
      - handleIntonationPointerUp ()
      - handleIntonationKeyDown ()
      - renderIntonationFavoritesList ()
      - removeIntonationFavorite ()
      - applyIntonationFavorite ()
      - saveCurrentIntonationFavorite ()
      - refreshIntonationChart ()
      - getBaseDisplayRange ()
      - applyRangeExtra ()
      - refreshDisplayRange ()
      - clampPitchToDisplayRange ()
      - calculateLetterKeyAdjustment ()
      - ensureWheelHandler ()
      - updateInitialRangeFromPoints ()
      - buildIntonationPointsFromQuery ()
      - drawIntonationChart ()
      - pitchFromY ()
      - findNearestIntonationPoint ()
      - scheduleIntonationPlayback ()
      - replayCachedIntonationAudio ()
      - playUpdatedIntonation ()
      - updateIntonationTiming ()
      - isValidAudioQueryShape ()
      - cloneAudioQuery ()
      - showStatus ()
      - scheduleHideStatus ()
  - getPitchRange (src/intonationDisplay.ts)
    - calculateBasePadding ()
      - calculateDisplayRange ()
      - clampRangeExtra ()
      - calculateStepSize ()
      - handleIntonationWheel ()
      - initializeIntonationCanvas ()
      - renderIntonationLabels ()
      - adjustIntonationScale ()
      - getColorVariable ()
  - fetchAndRenderIntonation ()
    - resetIntonationToInitial ()
      - updateExportButtonState ()
      - drawRenderedWaveform ()
      - initializeVisualizationCanvases ()
      - playAudio ()
  - applyStyleSelection (src/main.ts)
    - applyRandomStyleSelection ()
      - updateSpectrogramScaleLabel ()
      - updateIntonationKeyboardToggle ()
      - setLoopCheckboxElement ()
      - setPlayButtonAppearance ()
      - isPlayRequestPending ()
      - handlePlay ()
      - getSelectedStyleId ()
      - setSelectedStyleId ()
      - selectRandomStyleId ()
      - populateStyleSelect ()
      - populateSpeakerStyleSelect ()
      - fetchVoiceStyles ()
      - initializeTextLists ()
      - getSpectrogramScale ()
      - setSpectrogramScale ()
      - requestSpectrogramReset ()
      - isPlaybackActive ()
  - stopPlaybackAndResetLoop ()
    - getAudioCacheKey ()
      - setTextAndPlay ()
      - downloadLastAudio ()
      - scheduleAutoPlay ()
      - confirmResetIntonationBeforePlay ()
      - handlePlayButtonClick ()
      - cleanup ()
      - handleCancel ()
      - parseDelimiterConfig ()
      - buildTextSegments ()
      - addToHistory ()
      - stopActivePlayback ()
  - hideStatus ()
    - invalidateColorVariableCache ()
  - getStyleLabel ()
    - getStyleById ()
      - getSpeakerStylesByStyleId ()
      - resolveStyleMarker ()
      - addSegment ()
  - loadStoredList (src/textLists.ts)
    - persistList ()
      - persistLists ()
      - dedupeAndLimit ()
      - renderList ()
      - renderTextLists ()
      - moveToFavorites ()
      - moveToHistory ()
  - prepareCanvas (src/visualization/canvas.ts)
  - getHannWindow (src/visualization/fft.ts)
    - fftRadix2 ()
  - lerpColor (src/visualization/spectrogram.ts)
    - mapIntensityToSpectrogramColor ()
      - determineSpectrogramCeiling ()
      - estimateFundamentalFrequency ()
      - analyzeSpectrogramFrames ()
      - drawFrequencyTrack ()
      - drawSpectrogram ()
      - drawOfflineSpectrogram ()
      - computeAudioContentHash ()
      - buildSpectrogramSignature ()
      - processChunk ()
      - drawTimeTicks ()
  - formatTimeLabel (src/visualization/timeAxis.ts)
    - buildTimeTicks ()
  - estimateFrequencySeries (src/visualization/waveform.ts)
    - computeSegmentStats ()
      - computeSegmentCorrelation ()
      - extractAlignedRealtimeSegment ()
      - drawRealtimeWaveform ()
  - catch (src/audio.ts)
  - setProgressPosition ()
    - updateProgressLines ()
      - clearProgressLines ()
      - requestSpectrogramDraw ()
      - render ()
      - finalize ()
- for (src/audio.ts)
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)
- while (src/styleManager.ts)
- stopPlayback (src/visualization.ts)

---
Generated at: 2026-02-15 07:03:31 JST
