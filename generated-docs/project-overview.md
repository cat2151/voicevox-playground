Last updated: 2026-03-10

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、入力されたテキストを音声に変換して再生するWebアプリケーションです。
- ユーザーは任意のテキストを多様なキャラクターの音声で即座に読み上げさせ、イントネーション調整も可能です。
- VOICEVOXクライアントアプリを簡単に構築できることを実証し、手軽な音声生成体験を提供することを目指しています。

## 技術スタック
- フロントエンド: Vite (高速な開発サーバーとビルドツール)、HTML/CSS (Webアプリケーションの基本構造とスタイリング)
- 音楽・オーディオ: Tone.js v15 (Web Audio APIを抽象化し、音声再生や操作を容易にするライブラリ)、VOICEVOX API (VOICEVOXエンジンとのHTTPインターフェース)
- 開発ツール: TypeScript (静的型付けにより堅牢なコードを記述)、JSDOM (DOM操作のテストやシミュレーション)
- テスト: Vitest (高速なユニットテストフレームワーク)
- ビルドツール: Vite (プロダクション向けバンドルと最適化)
- 言語機能: TypeScript (JavaScriptに型システムを追加し、大規模開発を支援)
- 自動化・CI/CD: GitHub Actions (READMEの自動翻訳など、ワークフローの自動化に使用)
- 開発標準: Biome (コードのフォーマットとリンティングにより、コード品質と一貫性を維持)

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
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📁 intonation/
    📘 display.ts
    📘 favorites.ts
    📘 handlers.test.ts
    📘 handlers.ts
    📘 playback.test.ts
    📘 playback.ts
    📘 setup.ts
    📘 state.ts
    📘 utils.ts
  📘 intonation.test.ts
  📘 intonation.ts
  📘 main.ts
  📁 playback/
    📘 audioCache.ts
    📘 confirmDialog.ts
  📘 playback.test.ts
  📘 playback.truncation.test.ts
  📘 playback.ts
  📘 settings.test.ts
  📘 settings.ts
  📘 settingsPanel.test.ts
  📘 settingsPanel.ts
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
    📘 fftMaxFreq.ts
    📘 fftOverlay.test.ts
    📘 fftOverlay.ts
    📘 fftUtils.ts
    📘 spectrogram.ts
    📘 spectrogramCache.ts
    📘 timeAxis.ts
    📘 waveform.ts
  📘 visualization.test.ts
  📘 visualization.ts
  📘 vite-env.d.ts
📊 tsconfig.json
📘 vite.config.ts
```

## ファイル詳細説明
- **AGENTS.md**: プロジェクトにおける自動化エージェントやAIの利用に関するドキュメント。
- **biome.json**: Biome (コードフォーマッター/リンター) の設定ファイル。コードスタイルや品質ルールを定義。
- **generated-docs/**: 自動生成されたドキュメントやレポートを格納するディレクトリ。
- **index.html**: WebアプリケーションのメインエントリーポイントとなるHTMLファイル。ユーザーインターフェースの骨格を定義。
- **LICENSE**: プロジェクトのライセンス情報が記述されたファイル。
- **package-lock.json**: Node.jsプロジェクトの依存関係の正確なバージョンを記録するファイル。
- **package.json**: Node.jsプロジェクトのメタデータ、依存関係、スクリプトなどを定義するファイル。
- **README.ja.md**: プロジェクトの日本語版説明書。概要、機能、使い方などが記載。
- **README.md**: プロジェクトの英語版説明書。README.ja.mdの翻訳版。
- **src/audio.ts**: VOICEVOX APIへのリクエスト送信、音声データの取得、結合、WAVエンコードなどのオーディオ処理ロジック。
- **src/config.ts**: アプリケーション全体で使用される定数や設定値を定義。VOICEVOXサーバーのポート番号など。
- **src/intonation/display.ts**: イントネーション編集UIの表示ロジック、ピッチカーブの描画、ユーザー操作による表示範囲の調整など。
- **src/intonation/favorites.ts**: イントネーションのお気に入り設定を保存、読み込み、適用、エクスポート、インポートする機能。
- **src/intonation/handlers.test.ts**: イントネーション編集のためのイベントハンドラ（ポインター、キーボード）のテストコード。
- **src/intonation/handlers.ts**: イントネーション編集エリアでのポインター操作（ドラッグ、クリック）やキーボード操作を処理するイベントハンドラ。
- **src/intonation/playback.test.ts**: イントネーション編集後の音声再生ロジックに関するテストコード。
- **src/intonation/playback.ts**: イントネーションが編集されたオーディオクエリに基づいて音声を再生する機能、合成音声のキャッシュ管理。
- **src/intonation/setup.ts**: イントネーション編集UIの初期化、イベントリスナーの設定、コントロール要素の構成。
- **src/intonation/state.ts**: イントネーション編集の現在の状態（アクティブなクエリ、ピッチデータ、キーボード有効状態など）を一元的に管理。
- **src/intonation/utils.ts**: イントネーション関連の共通ユーティリティ関数（AudioQueryの検証やクローンなど）。
- **src/intonation.test.ts**: イントネーション機能全体の統合テスト。
- **src/intonation.ts**: イントネーション機能のエントリポイント。外部モジュールへのAPI提供や、スタイル変更・再生ハンドラの登録。
- **src/main.ts**: アプリケーションのメインエントリポイント。初期設定、主要なUIコンポーネントの初期化を呼び出す。
- **src/playback/audioCache.ts**: 生成された音声データのキャッシュ（AudioBuffer）を管理し、再度の合成リクエストを削減。
- **src/playback/confirmDialog.ts**: イントネーションリセット時の確認ダイアログ表示とユーザー応答の処理。
- **src/playback.test.ts**: 音声再生機能に関する様々なテストコード。
- **src/playback.truncation.test.ts**: 音声再生の切り捨て（トラクション）ロジックに関するテストコード。
- **src/playback.ts**: 音声再生の中核ロジック。再生ボタンの制御、ループ再生、ダウンロード、自動再生、VOICEVOXサーバーへのリクエスト管理。
- **src/settings.test.ts**: アプリケーション設定の保存・読み込みロジックに関するテストコード。
- **src/settings.ts**: アプリケーションの設定値（VOICEVOX APIのベースURL、ポート、周波数パーセンテージなど）をローカルストレージに保存・読み込み。
- **src/settingsPanel.test.ts**: 設定パネルUIの操作と表示に関するテストコード。
- **src/settingsPanel.ts**: 設定パネルのUI要素を初期化し、ユーザー入力に応じて設定を更新、スタイルのリフレッシュを行う。
- **src/state.ts**: アプリケーションのグローバルな状態を保持するシンプルなモジュール。
- **src/status.ts**: アプリケーションの動作状況（エラーメッセージ、ローディング表示など）をユーザーに通知するための表示管理。
- **src/styleManager.test.ts**: VOICEVOXの音声スタイル（キャラクター）選択機能に関するテストコード。
- **src/styleManager.ts**: VOICEVOXの音声スタイル（キャラクター）のフェッチ、選択、適用、UIへの反映を管理。
- **src/styles/base.css**: アプリケーションの一般的な要素（ボタン、入力フィールドなど）に対する基本的なCSSスタイル。
- **src/styles/intonation.css**: イントネーション編集UIに特化したCSSスタイル。
- **src/styles.css**: 他のCSSファイルをインポートするエントリポイントとなるスタイルシート。
- **src/textLists.test.ts**: テキスト履歴やお気に入りリスト機能に関するテストコード。
- **src/textLists.ts**: ユーザーが入力したテキストの履歴やお気に入りリストを管理し、ローカルストレージに永続化。
- **src/uiControls.ts**: アプリケーションの汎用的なUIコントロール（エクスポートボタンの状態更新、パネルの開閉、区切り文字入力）のロジック。
- **src/visualization/canvas.ts**: HTML Canvas要素の初期化やクリアなどの基本的な準備を行うユーティリティ。
- **src/visualization/fft.ts**: 高速フーリエ変換 (FFT) を実装し、音声信号の周波数成分を分析。
- **src/visualization/fftMaxFreq.ts**: FFT結果から最も支配的な周波数成分（ピーク周波数）を検出するロジック。
- **src/visualization/fftOverlay.test.ts**: FFTオーバーレイ表示の描画ロジックに関するテストコード。
- **src/visualization/fftOverlay.ts**: リアルタイムでFFTスペクトルをキャンバス上に描画し、音声の周波数特性を視覚化。
- **src/visualization/fftUtils.ts**: FFT結果を視覚化するための座標変換や補間などのユーティリティ関数。
- **src/visualization/spectrogram.ts**: スペクトログラムの分析（音声信号の時間-周波数表現）とキャンバスへの描画ロジック。
- **src/visualization/spectrogramCache.ts**: スペクトログラム画像をキャッシュし、描画のパフォーマンスを最適化する。
- **src/visualization/timeAxis.ts**: 音声再生のタイムライン上に時間軸の目盛りとラベルを描画。
- **src/visualization/waveform.ts**: 音声波形のデータ分析（セグメント統計、相関）とリアルタイム/オフラインでの波形描画。
- **src/visualization.test.ts**: 音声可視化機能全体に関するテストコード。
- **src/visualization.ts**: 音声波形、スペクトログラム、FFTなどの全ての可視化要素を一元的に管理し、再生状態と同期して描画。
- **src/vite-env.d.ts**: Vite環境で使用される型定義ファイル。
- **vite.config.ts**: Viteビルドツールの設定ファイル。バンドルや開発サーバーの挙動を定義。
- **tsconfig.json**: TypeScriptコンパイラの設定ファイル。コンパイルオプションなどを定義。

## 関数詳細説明
- **getAudioQuery(src/audio.ts)**: VOICEVOX APIから指定されたテキストとスタイルIDに基づいた音声クエリを取得します。引数: `text: string`, `speaker: number`, `styleId: number`。戻り値: `Promise<AudioQuery>`.
- **synthesize(src/audio.ts)**: 音声クエリとスタイルIDを使用して、VOICEVOX APIから音声データを合成して取得します。引数: `audioQuery: AudioQuery`, `speaker: number`, `styleId: number`。戻り値: `Promise<AudioBuffer>`.
- **combineAudioBuffers(src/audio.ts)**: 複数のAudioBufferを結合して一つのAudioBufferを生成します。引数: `buffers: AudioBuffer[]`, `context: AudioContext`。戻り値: `AudioBuffer`.
- **encodeAudioBufferToWav(src/audio.ts)**: AudioBufferの内容をWAV形式のBlobとしてエンコードします。引数: `audioBuffer: AudioBuffer`。戻り値: `Blob`.
- **writeString(src/audio.ts)**: データビューに文字列を書き込みます。WAVヘッダー生成の一部として使用されます。引数: `view: DataView`, `offset: number`, `s: string`。戻り値: なし.
- **clamp(src/audio.ts)**: 数値を指定された最小値と最大値の範囲内に制限します。引数: `num: number`, `min: number`, `max: number`。戻り値: `number`.
- **getPitchRange(src/intonation/display.ts)**: イントネーション表示のピッチ範囲を計算し取得します。引数: `query: AudioQuery`, `baseDisplayRange: number`。戻り値: `{ min: number, max: number }`.
- **calculateBasePadding(src/intonation/display.ts)**: 表示範囲の基本パディングを計算します。引数: `query: AudioQuery`。戻り値: `{ top: number, bottom: number }`.
- **getBaseDisplayRange(src/intonation/display.ts)**: イントネーション表示の基本表示範囲を計算します。引数: `query: AudioQuery`。戻り値: `number`.
- **calculateDisplayRange(src/intonation/display.ts)**: イントネーション表示の最終的な表示範囲を計算します。引数: `query: AudioQuery`, `baseRange: number`, `extraRange: number`。戻り値: `{ min: number, max: number }`.
- **clampRangeExtra(src/intonation/display.ts)**: 追加の表示範囲を特定の最小/最大値にクランプします。引数: `currentExtra: number`。戻り値: `number`.
- **applyRangeExtra(src/intonation/display.ts)**: イントネーション表示にオフセットを適用します。引数: `query: AudioQuery`, `offset: number`。戻り値: `void`.
- **refreshDisplayRange(src/intonation/display.ts)**: イントネーション表示の範囲を更新します。引数: なし。戻り値: `void`.
- **clampPitchToDisplayRange(src/intonation/display.ts)**: ピッチ値を現在の表示範囲にクランプします。引数: `pitch: number`。戻り値: `number`.
- **calculateStepSize(src/intonation/display.ts)**: イントネーション調整のステップサイズを計算します。引数: なし。戻り値: `number`.
- **calculateLetterKeyAdjustment(src/intonation/display.ts)**: キーボード入力によるイントネーション調整量を計算します。引数: `event: KeyboardEvent`。戻り値: `number`.
- **handleIntonationWheel(src/intonation/display.ts)**: イントネーション表示領域でのマウスホイールイベントを処理し、表示範囲を調整します。引数: `event: WheelEvent`。戻り値: `void`.
- **ensureWheelHandler(src/intonation/display.ts)**: イントネーション表示のマウスホイールハンドラーが適切に設定されていることを保証します。引数: なし。戻り値: `void`.
- **updateInitialRangeFromPoints(src/intonation/display.ts)**: イントネーションポイントから初期表示範囲を更新します。引数: `points: { x: number, y: number, char_index: number }[]`。戻り値: `void`.
- **initializeIntonationCanvas(src/intonation/display.ts)**: イントネーション編集用のキャンバスを初期化します。引数: `canvas: HTMLCanvasElement`。戻り値: `void`.
- **buildIntonationPointsFromQuery(src/intonation/display.ts)**: AudioQueryからイントネーション表示用のポイントデータを構築します。引数: `query: AudioQuery`。戻り値: `IntonationPoint[]`.
- **renderIntonationLabels(src/intonation/display.ts)**: イントネーション表示に文字ラベルを描画します。引数: `context: CanvasRenderingContext2D`, `query: AudioQuery`, `scaleY: number`, `offsetY: number`, `paddingLeft: number`。戻り値: `void`.
- **updateHoveredLabel(src/intonation/display.ts)**: マウスカーソルがホバーしている文字ラベルを更新します。引数: `x: number`。戻り値: `void`.
- **drawIntonationChart(src/intonation/display.ts)**: イントネーションチャート全体を描画します。引数: なし。戻り値: `void`.
- **adjustIntonationScale(src/intonation/display.ts)**: イントネーション表示のスケールを調整します。引数: `direction: 'up' | 'down'`。戻り値: `void`.
- **pitchFromY(src/intonation/display.ts)**: キャンバスのY座標からピッチ値を計算します。引数: `y: number`。戻り値: `number`.
- **findNearestIntonationPoint(src/intonation/display.ts)**: 指定されたX座標に最も近いイントネーションポイントを見つけます。引数: `x: number`。戻り値: `IntonationPoint | null`.
- **refreshIntonationChart(src/intonation/display.ts)**: イントネーションチャートの表示を再描画します。引数: なし。戻り値: `void`.
- **dedupeIntonationFavorites(src/intonation/favorites.ts)**: イントネーションのお気に入りリストから重複するエントリを削除します。引数: `favorites: IntonationFavorite[]`。戻り値: `IntonationFavorite[]`.
- **parseIntonationFavoritesArray(src/intonation/favorites.ts)**: 文字列からイントネーションお気に入り配列をパースします。引数: `jsonString: string`。戻り値: `IntonationFavorite[]`.
- **loadIntonationFavorites(src/intonation/favorites.ts)**: ローカルストレージからイントネーションのお気に入りを読み込みます。引数: なし。戻り値: `IntonationFavorite[]`.
- **persistIntonationFavorites(src/intonation/favorites.ts)**: イントネーションのお気に入りをローカルストレージに保存します。引数: `favorites: IntonationFavorite[]`。戻り値: `void`.
- **renderIntonationFavoritesList(src/intonation/favorites.ts)**: お気に入りリストのUI要素をレンダリングします。引数: なし。戻り値: `void`.
- **removeIntonationFavorite(src/intonation/favorites.ts)**: 指定されたインデックスのお気に入りを削除します。引数: `index: number`。戻り値: `void`.
- **applyIntonationFavorite(src/intonation/favorites.ts)**: 選択されたお気に入りのイントネーション設定を現在の編集に適用します。引数: `index: number`。戻り値: `void`.
- **exportIntonationFavorites(src/intonation/favorites.ts)**: お気に入りリストをJSONファイルとしてエクスポートします。引数: なし。戻り値: `void`.
- **importIntonationFavorites(src/intonation/favorites.ts)**: JSONファイルからお気に入りリストをインポートします。引数: `file: File`。戻り値: `Promise<void>`.
- **saveCurrentIntonationFavorite(src/intonation/favorites.ts)**: 現在のイントネーション設定をお気に入りとして保存します。引数: `name: string`。戻り値: `void`.
- **makeKeyEvent(src/intonation/handlers.test.ts)**: キーボードイベントをシミュレートするためのヘルパー関数。引数: `key: string`, `modifiers?: { ctrl?: boolean, shift?: boolean, alt?: boolean, meta?: boolean }`。戻り値: `KeyboardEvent`.
- **enableKeyboard(src/intonation/handlers.test.ts)**: キーボード操作を有効にするためのヘルパー関数。引数: `state: IntonationState`。戻り値: `void`.
- **disableLoopOnIntonationEdit(src/intonation/handlers.ts)**: イントネーション編集時にループ再生を無効化します。引数: なし。戻り値: `void`.
- **applyPitchToQuery(src/intonation/handlers.ts)**: 編集されたピッチデータをAudioQueryに適用します。引数: `index: number`, `newPitch: number`。戻り値: `void`.
- **applyPitchEdit(src/intonation/handlers.ts)**: 指定されたピッチポイントにピッチ調整を適用します。引数: `index: number`, `deltaY: number`。戻り値: `void`.
- **handleIntonationPointerDown(src/intonation/handlers.ts)**: イントネーション編集領域でのポインターダウンイベントを処理します。引数: `event: PointerEvent`。戻り値: `void`.
- **handleIntonationPointerMove(src/intonation/handlers.ts)**: イントネーション編集領域でのポインター移動イベントを処理します。引数: `event: PointerEvent`。戻り値: `void`.
- **handleIntonationPointerUp(src/intonation/handlers.ts)**: イントネーション編集領域でのポインターアップイベントを処理します。引数: `event: PointerEvent`。戻り値: `void`.
- **handleIntonationMouseMove(src/intonation/handlers.ts)**: イントネーション編集領域でのマウス移動イベントを処理します。引数: `event: MouseEvent`。戻り値: `void`.
- **handleIntonationMouseLeave(src/intonation/handlers.ts)**: イントネーション編集領域からマウスが離れたイベントを処理します。引数: `event: MouseEvent`。戻り値: `void`.
- **handleIntonationKeyDown(src/intonation/handlers.ts)**: イントネーション編集領域でのキーボードダウンイベントを処理します。引数: `event: KeyboardEvent`。戻り値: `void`.
- **scheduleIntonationPlayback(src/intonation/playback.ts)**: イントネーション編集後の音声を合成・再生するための処理をスケジュールします。引数: なし。戻り値: `void`.
- **replayCachedIntonationAudio(src/intonation/playback.ts)**: キャッシュされたイントネーションの音声を再生します。引数: `query: AudioQuery`, `buffer: AudioBuffer`。戻り値: `void`.
- **showPlaybackStatus(src/intonation/playback.ts)**: イントネーション再生のステータス（エラーメッセージなど）を表示します。引数: `message: string`, `isError: boolean`。戻り値: `void`.
- **buildSynthesisCacheKey(src/intonation/playback.ts)**: イントネーション編集された合成音声のキャッシュキーを生成します。引数: `query: AudioQuery`, `speaker: number`, `styleId: number`。戻り値: `string`.
- **playUpdatedIntonation(src/intonation/playback.ts)**: イントネーションが更新された音声を再生します。必要に応じて合成・キャッシュします。引数: `options?: { fromCacheOnly?: boolean }`。戻り値: `Promise<void>`.
- **fetchAndRenderIntonation(src/intonation/playback.ts)**: イントネーションデータを取得し、UIにレンダリングします。引数: `query: AudioQuery`, `speaker: number`, `styleId: number`。戻り値: `void`.
- **resetIntonationToInitial(src/intonation/playback.ts)**: イントネーションを初期状態にリセットします。引数: なし。戻り値: `void`.
- **initializeIntonationElements(src/intonation/setup.ts)**: イントネーション関連のDOM要素を初期化します。引数: なし。戻り値: `void`.
- **setupIntonationCanvasEvents(src/intonation/setup.ts)**: イントネーションキャンバスにイベントリスナーを設定します。引数: `canvas: HTMLCanvasElement`。戻り値: `void`.
- **initializeIntonationControls(src/intonation/setup.ts)**: イントネーション調整用のコントロール要素を初期化します。引数: なし。戻り値: `void`.
- **updateIntonationKeyboardToggle(src/intonation/setup.ts)**: イントネーションキーボード操作の有効/無効トグルUIを更新します。引数: なし。戻り値: `void`.
- **updateIntonationTiming(src/intonation/state.ts)**: イントネーションのタイミング情報を更新します。引数: `query: AudioQuery`。戻り値: `void`.
- **getIntonationKeyboardEnabled(src/intonation/state.ts)**: イントネーションのキーボード操作が現在有効かどうかを返します。引数: なし。戻り値: `boolean`.
- **setIntonationKeyboardEnabled(src/intonation/state.ts)**: イントネーションのキーボード操作の有効/無効を設定します。引数: `enabled: boolean`。戻り値: `void`.
- **resetIntonationState(src/intonation/state.ts)**: イントネーションの状態を初期値にリセットします。引数: なし。戻り値: `void`.
- **isValidAudioQueryShape(src/intonation/utils.ts)**: 指定されたオブジェクトが有効なAudioQueryの形状をしているか検証します。引数: `query: unknown`。戻り値: `query is AudioQuery`.
- **cloneAudioQuery(src/intonation/utils.ts)**: AudioQueryオブジェクトをディープクローンします。引数: `query: AudioQuery`。戻り値: `AudioQuery`.
- **setStyleChangeHandler(src/intonation.ts)**: スタイル変更時のハンドラを設定します。引数: `handler: (styleId: number) => void`。戻り値: `void`.
- **setHandlePlayHandler(src/intonation.ts)**: 再生ハンドラを設定します。引数: `handler: () => void`。戻り値: `void`.
- **isIntonationDirty(src/intonation.ts)**: イントネーションが変更されているかどうかを返します。引数: なし。戻り値: `boolean`.
- **isIntonationActive(src/intonation.ts)**: イントネーション編集が現在アクティブかどうかを返します。引数: なし。戻り値: `boolean`.
- **hasActiveIntonationQuery(src/intonation.ts)**: アクティブなイントネーションクエリがあるかどうかを返します。引数: なし。戻り値: `boolean`.
- **clearAudioCache(src/playback/audioCache.ts)**: 音声キャッシュをクリアします。引数: なし。戻り値: `void`.
- **getAudioCacheKey(src/playback/audioCache.ts)**: 指定された情報から音声キャッシュキーを生成します。引数: `text: string`, `speaker: number`, `styleId: number`。戻り値: `string`.
- **getCachedAudio(src/playback/audioCache.ts)**: 指定されたキャッシュキーで音声データを取得します。引数: `key: string`。戻り値: `AudioBuffer | undefined`.
- **setCachedAudio(src/playback/audioCache.ts)**: 指定されたキーで音声データをキャッシュに保存します。引数: `key: string`, `buffer: AudioBuffer`。戻り値: `void`.
- **confirmResetIntonationBeforePlay(src/playback/confirmDialog.ts)**: 再生前にイントネーションのリセットが必要か確認するダイアログを表示します。引数: `onConfirm: () => void`, `onCancel: () => void`。戻り値: `void`.
- **cleanup(src/playback/confirmDialog.ts)**: 確認ダイアログのDOM要素をクリーンアップします。引数: なし。戻り値: `void`.
- **handleReset(src/playback/confirmDialog.ts)**: 確認ダイアログでリセットが選択された際のハンドラ。引数: `onConfirm: () => void`。戻り値: `void`.
- **handleCancel(src/playback/confirmDialog.ts)**: 確認ダイアログでキャンセルが選択された際のハンドラ。引数: `onCancel: () => void`。戻り値: `void`.
- **setLoopCheckboxElement(src/playback.ts)**: ループ再生チェックボックスのDOM要素を設定します。引数: `element: HTMLInputElement`。戻り値: `void`.
- **setPlayButtonAppearance(src/playback.ts)**: 再生ボタンの見た目を現在の再生状態に合わせて更新します。引数: `isPlaying: boolean`。戻り値: `void`.
- **isPlayRequestPending(src/playback.ts)**: 再生リクエストが保留中かどうかを返します。引数: なし。戻り値: `boolean`.
- **stopPlaybackAndResetLoop(src/playback.ts)**: 現在の再生を停止し、ループ設定をリセットします。引数: なし。戻り値: `void`.
- **setTextAndPlay(src/playback.ts)**: 指定されたテキストを設定し、再生を開始します。引数: `text: string`。戻り値: `void`.
- **downloadLastAudio(src/playback.ts)**: 最後に再生された音声をWAVファイルとしてダウンロードします。引数: なし。戻り値: `void`.
- **scheduleAutoPlay(src/playback.ts)**: 自動再生をスケジュールします。引数: なし。戻り値: `void`.
- **handlePlayButtonClick(src/playback.ts)**: 再生ボタンクリックイベントを処理します。引数: なし。戻り値: `Promise<void>`.
- **handlePlay(src/playback.ts)**: 実際の音声再生ロジックを実行します。引数: `text?: string`。戻り値: `Promise<void>`.
- **clearRealtimeWaveformCanvas(src/playback.ts)**: リアルタイム波形キャンバスをクリアします。引数: なし。戻り値: `void`.
- **initializePlaybackControls(src/playback.ts)**: 再生コントロール関連のDOM要素を初期化します。引数: なし。戻り値: `void`.
- **triggerPlay(src/playback.ts)**: 再生処理をトリガーします。引数: なし。戻り値: `void`.
- **loadSettings(src/settings.ts)**: ローカルストレージからアプリケーション設定を読み込みます。引数: なし。戻り値: `Settings`.
- **saveSettings(src/settings.ts)**: 現在のアプリケーション設定をローカルストレージに保存します。引数: `settings: Settings`。戻り値: `void`.
- **resetSettings(src/settings.ts)**: アプリケーション設定をデフォルト値にリセットします。引数: なし。戻り値: `void`.
- **getVoicevoxApiBase(src/settings.ts)**: 現在設定されているVOICEVOX APIのベースURLを取得します。引数: なし。戻り値: `string`.
- **getVoicevoxNemoApiBase(src/settings.ts)**: 現在設定されているVOICEVOX Nemo APIのベースURLを取得します。引数: なし。戻り値: `string`.
- **getFrequencyTopPercent(src/settings.ts)**: 周波数表示の上位パーセンテージ設定を取得します。引数: なし。戻り値: `number`.
- **getCurrentSettings(src/settings.ts)**: 現在のアクティブな設定オブジェクトを返します。引数: なし。戻り値: `Settings`.
- **setVoicevoxPort(src/settings.ts)**: VOICEVOX APIのポート番号を設定します。引数: `port: string`。戻り値: `void`.
- **setVoicevoxNemoPort(src/settings.ts)**: VOICEVOX Nemo APIのポート番号を設定します。引数: `port: string`。戻り値: `void`.
- **setFrequencyTopPercent(src/settings.ts)**: 周波数表示の上位パーセンテージを設定します。引数: `percent: number`。戻り値: `void`.
- **makeInput(src/settingsPanel.test.ts)**: 入力要素をシミュレートするためのヘルパー関数。引数: `id: string`, `value: string`, `type: string`。戻り値: `HTMLInputElement`.
- **makeButton(src/settingsPanel.test.ts)**: ボタン要素をシミュレートするためのヘルパー関数。引数: `id: string`。戻り値: `HTMLButtonElement`.
- **makePanel(src/settingsPanel.test.ts)**: パネル要素をシミュレートするためのヘルパー関数。引数: `id: string`。戻り値: `HTMLElement`.
- **fireChange(src/settingsPanel.test.ts)**: 変更イベントをトリガーするためのヘルパー関数。引数: `element: HTMLElement`。戻り値: `void`.
- **initializeSettingsPanelFromDOM(src/settingsPanel.ts)**: DOM要素から設定パネルを初期化します。引数: なし。戻り値: `void`.
- **initializeSettingsPanel(src/settingsPanel.ts)**: 設定パネルのUIとイベントハンドラを初期化します。引数: なし。戻り値: `void`.
- **applySettingsToInputs(src/settingsPanel.ts)**: 現在の設定値を設定パネルの入力フィールドに適用します。引数: なし。戻り値: `void`.
- **refreshStylesAfterPortChange(src/settingsPanel.ts)**: ポート変更後にスタイル関連の情報をリフレッシュします。引数: なし。戻り値: `void`.
- **showStatus(src/status.ts)**: ステータスメッセージを表示します。引数: `message: string`, `options?: { isError?: boolean, hideDelay?: number }`。戻り値: `void`.
- **hideStatus(src/status.ts)**: ステータスメッセージを非表示にします。引数: なし。戻り値: `void`.
- **scheduleHideStatus(src/status.ts)**: 指定された遅延時間後にステータスメッセージを非表示にするようスケジュールします。引数: `delay: number`。戻り値: `void`.
- **invalidateColorVariableCache(src/status.ts)**: CSSカラー変数のキャッシュを無効にします。引数: なし。戻り値: `void`.
- **getColorVariable(src/status.ts)**: CSSカスタムプロパティから色変数の値を取得します。引数: `variableName: string`。戻り値: `string`.
- **getSelectedStyleId(src/styleManager.ts)**: 現在選択されているVOICEVOXスタイルIDを取得します。引数: なし。戻り値: `number`.
- **setSelectedStyleId(src/styleManager.ts)**: 現在選択されているVOICEVOXスタイルIDを設定します。引数: `id: number`。戻り値: `void`.
- **selectRandomStyleId(src/styleManager.ts)**: ランダムなVOICEVOXスタイルIDを選択します。引数: なし。戻り値: `void`.
- **getStyleLabel(src/styleManager.ts)**: スタイルIDからラベル（キャラクター名とスタイル名）を取得します。引数: `styleId: number`。戻り値: `string`.
- **getStyleById(src/styleManager.ts)**: スタイルIDからスタイルオブジェクト全体を取得します。引数: `styleId: number`。戻り値: `StyleInfo | undefined`.
- **getApiBaseForStyleId(src/styleManager.ts)**: 特定のスタイルIDに対応するAPIベースURLを取得します。引数: `styleId: number`。戻り値: `string`.
- **getSpeakerStylesByStyleId(src/styleManager.ts)**: スタイルIDに紐づくスピカースタイル情報を取得します。引数: `styleId: number`。戻り値: `StyleInfo[]`.
- **resolveStyleMarker(src/styleManager.ts)**: スタイルマーカーを解決します。引数: `text: string`, `styles: StyleInfo[]`。戻り値: `ResolvedStyleMarker[]`.
- **parseDelimiterConfig(src/styleManager.ts)**: 区切り文字設定をパースします。引数: `config: string`。戻り値: `DelimiterConfig[]`.
- **addSegment(src/styleManager.ts)**: テキストセグメントを追加します。引数: `segments: TextSegment[]`, `start: number`, `end: number`, `styleId: number`, `text: string`。戻り値: `void`.
- **buildTextSegments(src/styleManager.ts)**: 入力テキストからスタイルに基づくテキストセグメントを構築します。引数: `text: string`。戻り値: `TextSegment[]`.
- **populateStyleSelect(src/styleManager.ts)**: スタイル選択UIをVOICEVOXのスタイルデータで埋めます。引数: なし。戻り値: `void`.
- **populateSpeakerStyleSelect(src/styleManager.ts)**: スピーカーのスタイル選択UIを更新します。引数: なし。戻り値: `void`.
- **fetchVoiceStyles(src/styleManager.ts)**: VOICEVOX APIから利用可能な音声スタイル（キャラクター）情報をフェッチします。引数: なし。戻り値: `Promise<void>`.
- **applyStyleSelection(src/styleManager.ts)**: 選択されたスタイルをアプリケーション全体に適用します。引数: `styleId: number`。戻り値: `void`.
- **initializeStyleControls(src/styleManager.ts)**: スタイル選択関連のUIコントロールを初期化します。引数: なし。戻り値: `void`.
- **loadStoredList(src/textLists.ts)**: ローカルストレージから指定されたリストを読み込みます。引数: `key: string`。戻り値: `string[]`.
- **persistList(src/textLists.ts)**: 指定されたキーでリストをローカルストレージに保存します。引数: `key: string`, `list: string[]`。戻り値: `void`.
- **persistLists(src/textLists.ts)**: 全てのテキストリスト（履歴、お気に入り）をローカルストレージに保存します。引数: なし。戻り値: `void`.
- **dedupeAndLimit(src/textLists.ts)**: リストから重複を削除し、指定された制限数に調整します。引数: `list: string[]`, `limit: number`。戻り値: `string[]`.
- **renderList(src/textLists.ts)**: 指定されたリストをUIにレンダリングします。引数: `listElement: HTMLElement`, `list: string[]`, `className: string`。戻り値: `void`.
- **renderTextLists(src/textLists.ts)**: 履歴とお気に入りリストをUIにレンダリングします。引数: なし。戻り値: `void`.
- **moveToFavorites(src/textLists.ts)**: 履歴からテキストをお気に入りリストに移動します。引数: `text: string`。戻り値: `void`.
- **moveToHistory(src/textLists.ts)**: お気に入りからテキストを履歴リストに移動します。引数: `text: string`。戻り値: `void`.
- **addToHistory(src/textLists.ts)**: 指定されたテキストを履歴リストに追加します。引数: `text: string`。戻り値: `void`.
- **initializeTextLists(src/textLists.ts)**: テキストリスト（履歴、お気に入り）のUI要素とイベントハンドラを初期化します。引数: なし。戻り値: `void`.
- **updateExportButtonState(src/uiControls.ts)**: エクスポートボタンの有効/無効状態を更新します。引数: なし。戻り値: `void`.
- **initializePanelToggles(src/uiControls.ts)**: パネルの開閉トグルボタンを初期化します。引数: なし。戻り値: `void`.
- **initializeDelimiterInput(src/uiControls.ts)**: 区切り文字入力フィールドと関連イベントを初期化します。引数: なし。戻り値: `void`.
- **saveDelimiter(src/uiControls.ts)**: 入力された区切り文字設定を保存します。引数: なし。戻り値: `void`.
- **prepareCanvas(src/visualization/canvas.ts)**: キャンバス要素を準備し、コンテキストを取得します。引数: `canvas: HTMLCanvasElement`。戻り値: `CanvasRenderingContext2D`.
- **getHannWindow(src/visualization/fft.ts)**: ハニング窓関数を生成します。引数: `size: number`。戻り値: `Float32Array`.
- **fftRadix2(src/visualization/fft.ts)**: ラディックス2FFTアルゴリズムを実行します。引数: `buffer: number[]`。戻り値: `number[]`.
- **getMaxFreqByThreshold(src/visualization/fftMaxFreq.ts)**: 指定された閾値に基づいて最大周波数を見つけます。引数: `buffer: number[]`, `threshold: number`。戻り値: `number`.
- **drawRealtimeFFT(src/visualization/fftOverlay.ts)**: リアルタイムのFFTスペクトルをキャンバスに描画します。引数: `data: Float32Array`, `audioContext: AudioContext`, `canvas: HTMLCanvasElement`。戻り値: `void`.
- **getTopFreqInfo(src/visualization/fftOverlay.ts)**: FFTデータから上位の周波数情報を抽出します。引数: `data: Float32Array`, `audioContext: AudioContext`。戻り値: `{ peakFreq: number, topBinFreq: number }`.
- **findPeakPosition(src/visualization/fftOverlay.ts)**: FFTデータ内で最も高いピークの位置を見つけます。引数: `data: Float32Array`。戻り値: `number`.
- **drawPeakLine(src/visualization/fftOverlay.ts)**: FFTオーバーレイ上にピーク周波数を示す線を描画します。引数: `context: CanvasRenderingContext2D`, `x: number`, `y: number`。戻り値: `void`.
- **drawFFTLine(src/visualization/fftOverlay.ts)**: FFTスペクトル曲線を描画します。引数: `context: CanvasRenderingContext2D`, `data: Float32Array`, `canvasWidth: number`, `canvasHeight: number`。戻り値: `void`.
- **drawTopBinLine(src/visualization/fftOverlay.ts)**: 上位のビン周波数を示す線を描画します。引数: `context: CanvasRenderingContext2D`, `x: number`, `y: number`。戻り値: `void`.
- **drawPeakLabel(src/visualization/fftOverlay.ts)**: ピーク周波数のラベルを描画します。引数: `context: CanvasRenderingContext2D`, `text: string`, `x: number`, `y: number`。戻り値: `void`.
- **xToFreq(src/visualization/fftUtils.ts)**: X座標を周波数に変換します。引数: `x: number`, `canvasWidth: number`, `maxFreq: number`。戻り値: `number`.
- **freqToBinF(src/visualization/fftUtils.ts)**: 周波数をFFTビンインデックスに変換します（浮動小数点）。引数: `freq: number`, `sampleRate: number`, `fftSize: number`。戻り値: `number`.
- **getInterpolatedValue(src/visualization/fftUtils.ts)**: 補間されたFFT値を取得します。引数: `data: Float32Array`, `binF: number`。戻り値: `number`.
- **fftValueToY(src/visualization/fftUtils.ts)**: FFT値をキャンバスのY座標に変換します。引数: `value: number`, `canvasHeight: number`。戻り値: `number`.
- **lerpColor(src/visualization/spectrogram.ts)**: 2つの色間で線形補間を行います。引数: `a: { r: number, g: number, b: number }`, `b: { r: number, g: number, b: number }`, `amount: number`。戻り値: `{ r: number, g: number, b: number }`.
- **mapIntensityToSpectrogramColor(src/visualization/spectrogram.ts)**: 音声強度をスペクトログラムの色にマッピングします。引数: `intensity: number`, `ceiling: number`。戻り値: `string`.
- **determineSpectrogramCeiling(src/visualization/spectrogram.ts)**: スペクトログラムの描画に使用する強度の最大値（天井）を決定します。引数: `data: Float32Array`。戻り値: `number`.
- **analyzeSpectrogramFrames(src/visualization/spectrogram.ts)**: オーディオバッファからスペクトログラムフレームを分析します。引数: `audioBuffer: AudioBuffer`, `chunkSize: number`, `overlap: number`。戻り値: `Float32Array[]`.
- **drawSpectrogram(src/visualization/spectrogram.ts)**: スペクトログラム全体をキャンバスに描画します。引数: `context: CanvasRenderingContext2D`, `frames: Float32Array[]`, `canvasWidth: number`, `canvasHeight: number`。戻り値: `void`.
- **drawSpectrogramColumn(src/visualization/spectrogram.ts)**: スペクトログラムの単一列（時間スライス）を描画します。引数: `context: CanvasRenderingContext2D`, `frame: Float32Array`, `x: number`, `canvasHeight: number`, `columnWidth: number`, `ceiling: number`。戻り値: `void`.
- **drawOfflineSpectrogram(src/visualization/spectrogram.ts)**: オフライン（リアルタイムではない）のスペクトログラムを描画します。引数: `audioBuffer: AudioBuffer`, `canvas: HTMLCanvasElement`。戻り値: `Promise<void>`.
- **computeAudioContentHash(src/visualization/spectrogram.ts)**: AudioBufferの内容からハッシュ値を計算します。引数: `audioBuffer: AudioBuffer`。戻り値: `string`.
- **buildSpectrogramSignature(src/visualization/spectrogram.ts)**: スペクトログラムの署名（ハッシュと設定の組み合わせ）を生成します。引数: `audioBuffer: AudioBuffer`, `speaker: number`, `styleId: number`。戻り値: `string`.
- **processChunk(src/visualization/spectrogram.ts)**: スペクトログラム分析のチャンクを処理します。引数: `processor: ScriptProcessorNode`, `buffer: Float32Array`。戻り値: `void`.
- **getSpectrogramScale(src/visualization/spectrogramCache.ts)**: 現在のスペクトログラムスケール設定を取得します。引数: なし。戻り値: `string`.
- **setSpectrogramScale(src/visualization/spectrogramCache.ts)**: スペクトログラムスケール設定を設定します。引数: `scale: string`。戻り値: `void`.
- **requestSpectrogramReset(src/visualization/spectrogramCache.ts)**: スペクトログラムのキャッシュリセットを要求します。引数: なし。戻り値: `void`.
- **createSpectrogramImageCache(src/visualization/spectrogramCache.ts)**: スペクトログラムの画像キャッシュを作成します。引数: `canvas: HTMLCanvasElement`, `audioBuffer: AudioBuffer`。戻り値: `void`.
- **analyzeAndCacheSpectrogram(src/visualization/spectrogramCache.ts)**: スペクトログラムを分析し、キャッシュに保存します。引数: `audioBuffer: AudioBuffer`, `speaker: number`, `styleId: number`。戻り値: `Promise<HTMLImageElement | undefined>`.
- **handleSpectrogramInitialization(src/visualization/spectrogramCache.ts)**: スペクトログラムの初期化を処理します。引数: なし。戻り値: `Promise<void>`.
- **resetSpectrogramCaches(src/visualization/spectrogramCache.ts)**: 全てのスペクトログラムキャッシュをリセットします。引数: なし。戻り値: `void`.
- **formatTimeLabel(src/visualization/timeAxis.ts)**: 時間（秒）をフォーマットされた文字列ラベルに変換します。引数: `seconds: number`。戻り値: `string`.
- **buildTimeTicks(src/visualization/timeAxis.ts)**: 時間軸の目盛り位置を計算します。引数: `duration: number`, `canvasWidth: number`。戻り値: `{ time: number, x: number }[]`.
- **drawTimeTicks(src/visualization/timeAxis.ts)**: 時間軸の目盛りとラベルをキャンバスに描画します。引数: `context: CanvasRenderingContext2D`, `duration: number`, `canvasWidth: number`, `canvasHeight: number`。戻り値: `void`.
- **computeSegmentStats(src/visualization/waveform.ts)**: 波形セグメントの統計情報（平均、最大など）を計算します。引数: `audioBuffer: AudioBuffer`, `segmentDuration: number`。戻り値: `SegmentStats[]`.
- **computeSegmentCorrelation(src/visualization/waveform.ts)**: 波形セグメント間の相関を計算します。引数: `segment1: Float32Array`, `segment2: Float32Array`。戻り値: `number`.
- **extractAlignedRealtimeSegment(src/visualization/waveform.ts)**: リアルタイム波形からアライメントされたセグメントを抽出します。引数: `inputBuffer: Float32Array`, `segmentDuration: number`。戻り値: `Float32Array`.
- **drawRenderedWaveform(src/visualization/waveform.ts)**: 合成された音声の波形をキャンバスに描画します。引数: `audioBuffer: AudioBuffer`, `canvas: HTMLCanvasElement`。戻り値: `void`.
- **drawRealtimeWaveformBackground(src/visualization/waveform.ts)**: リアルタイム波形キャンバスの背景を描画します。引数: `context: CanvasRenderingContext2D`, `canvasWidth: number`, `canvasHeight: number`。戻り値: `void`.
- **drawRealtimeWaveformOnly(src/visualization/waveform.ts)**: リアルタイム波形データのみをキャンバスに描画します。引数: `context: CanvasRenderingContext2D`, `data: Float32Array`, `canvasWidth: number`, `canvasHeight: number`。戻り値: `void`.
- **isPlaybackActive(src/visualization.ts)**: 現在音声が再生中かどうかを返します。引数: なし。戻り値: `boolean`.
- **stopActivePlayback(src/visualization.ts)**: アクティブな音声再生を停止します。引数: なし。戻り値: `void`.
- **initializeVisualizationCanvases(src/visualization.ts)**: 可視化用のキャンバス要素を初期化します。引数: なし。戻り値: `void`.
- **clearWaveformCanvas(src/visualization.ts)**: 波形キャンバスをクリアします。引数: なし。戻り値: `void`.
- **playAudio(src/visualization.ts)**: AudioBufferを再生します。引数: `buffer: AudioBuffer`。戻り値: `Promise<void>`.
- **setProgressPosition(src/visualization.ts)**: 再生プログレスバーの位置を設定します。引数: `position: number`。戻り値: `void`.
- **updateProgressLines(src/visualization.ts)**: 再生プログレスラインを更新します。引数: `time: number`。戻り値: `void`.
- **clearProgressLines(src/visualization.ts)**: 再生プログレスラインをクリアします。引数: なし。戻り値: `void`.
- **drawRealtimeVisuals(src/visualization.ts)**: リアルタイムの音声可視化（波形、FFT）を描画します。引数: `data: Float32Array`。戻り値: `void`.
- **handleSpectrogramDraw(src/visualization.ts)**: スペクトログラムの描画を処理します。引数: なし。戻り値: `Promise<void>`.
- **cleanupPlayback(src/visualization.ts)**: 再生後のクリーンアップ処理を行います。引数: なし。戻り値: `void`.
- **requestSpectrogramDraw(src/visualization.ts)**: スペクトログラムの描画を要求します。引数: なし。戻り値: `void`.
- **render(src/visualization.ts)**: 可視化のレンダリングループを開始します。引数: なし。戻り値: `void`.
- **finalize(src/visualization.ts)**: 可視化の最終処理（リソース解放など）を行います。引数: なし。戻り値: `void`.
- **stopPlayback(src/visualization.ts)**: 可視化に関連する再生を停止します。引数: なし。戻り値: `void`.
- **initializeSpectrogramScaleToggle(src/visualization.ts)**: スペクトログラムスケールトグルUIを初期化します。引数: なし。戻り値: `void`.
- **updateLabel(src/visualization.ts)**: 可視化に関連するラベルを更新します。引数: なし。戻り値: `void`.

## 関数呼び出し階層ツリー
```
- getAudioQuery (src/audio.ts)
  - synthesize ()
    - combineAudioBuffers ()
    - encodeAudioBufferToWav ()
    - writeString ()
    - clamp ()
- getPitchRange (src/intonation/display.ts)
  - calculateBasePadding ()
    - getBaseDisplayRange ()
    - calculateDisplayRange ()
    - clampRangeExtra ()
    - applyRangeExtra ()
    - refreshDisplayRange ()
    - clampPitchToDisplayRange ()
    - calculateStepSize ()
    - calculateLetterKeyAdjustment ()
    - handleIntonationWheel ()
    - ensureWheelHandler ()
    - updateInitialRangeFromPoints ()
    - initializeIntonationCanvas ()
    - buildIntonationPointsFromQuery ()
    - renderIntonationLabels ()
    - updateHoveredLabel ()
    - drawIntonationChart ()
    - adjustIntonationScale ()
    - pitchFromY ()
    - findNearestIntonationPoint ()
    - refreshIntonationChart ()
    - getColorVariable ()
- dedupeIntonationFavorites (src/intonation/favorites.ts)
  - parseIntonationFavoritesArray ()
    - loadIntonationFavorites ()
    - persistIntonationFavorites ()
    - renderIntonationFavoritesList ()
    - removeIntonationFavorite ()
    - applyIntonationFavorite ()
    - exportIntonationFavorites ()
    - importIntonationFavorites ()
    - saveCurrentIntonationFavorite ()
    - playUpdatedIntonation ()
    - isValidAudioQueryShape ()
    - cloneAudioQuery ()
    - showStatus ()
    - scheduleHideStatus ()
    - stopActivePlayback ()
- disableLoopOnIntonationEdit (src/intonation/handlers.ts)
  - applyPitchToQuery ()
    - applyPitchEdit ()
    - handleIntonationPointerDown ()
    - handleIntonationPointerMove ()
    - handleIntonationPointerUp ()
    - handleIntonationMouseMove ()
    - handleIntonationMouseLeave ()
    - handleIntonationKeyDown ()
    - scheduleIntonationPlayback ()
    - replayCachedIntonationAudio ()
    - showPlaybackStatus ()
- buildSynthesisCacheKey ()
  - fetchAndRenderIntonation ()
    - resetIntonationToInitial ()
    - updateIntonationTiming ()
    - getApiBaseForStyleId ()
    - updateExportButtonState ()
    - drawRenderedWaveform ()
    - initializeVisualizationCanvases ()
    - playAudio ()
- initializeIntonationElements (src/intonation/setup.ts)
  - setupIntonationCanvasEvents ()
    - initializeIntonationControls ()
    - updateIntonationKeyboardToggle ()
    - getIntonationKeyboardEnabled ()
    - setIntonationKeyboardEnabled ()
    - getSelectedStyleId ()
- resetIntonationState ()
- setHandlePlayHandler ()
  - setStyleChangeHandler (src/intonation.ts)
    - isIntonationDirty ()
    - isIntonationActive ()
    - hasActiveIntonationQuery ()
- clearAudioCache (src/playback/audioCache.ts)
  - getAudioCacheKey ()
    - getCachedAudio ()
    - setCachedAudio ()
- confirmResetIntonationBeforePlay (src/playback/confirmDialog.ts)
  - cleanup ()
    - handleCancel ()
- setLoopCheckboxElement (src/playback.ts)
  - setPlayButtonAppearance ()
    - isPlayRequestPending ()
    - stopPlaybackAndResetLoop ()
    - setTextAndPlay ()
    - downloadLastAudio ()
    - scheduleAutoPlay ()
    - handlePlayButtonClick ()
    - handlePlay ()
    - clearRealtimeWaveformCanvas ()
    - initializePlaybackControls ()
    - setSelectedStyleId ()
    - selectRandomStyleId ()
    - parseDelimiterConfig ()
    - buildTextSegments ()
    - populateSpeakerStyleSelect ()
    - addToHistory ()
    - isPlaybackActive ()
- loadSettings (src/settings.ts)
  - saveSettings ()
    - resetSettings ()
    - getVoicevoxApiBase ()
    - getVoicevoxNemoApiBase ()
    - getFrequencyTopPercent ()
    - getCurrentSettings ()
    - setVoicevoxPort ()
    - setVoicevoxNemoPort ()
    - setFrequencyTopPercent ()
- initializeSettingsPanelFromDOM (src/settingsPanel.ts)
  - initializeSettingsPanel ()
    - applySettingsToInputs ()
    - refreshStylesAfterPortChange ()
    - fetchVoiceStyles ()
- hideStatus ()
  - invalidateColorVariableCache ()
- getStyleLabel ()
  - getStyleById ()
    - getSpeakerStylesByStyleId ()
    - resolveStyleMarker ()
    - addSegment ()
    - populateStyleSelect ()
    - applyStyleSelection ()
    - initializeStyleControls ()
- loadStoredList (src/textLists.ts)
  - persistList ()
    - persistLists ()
    - dedupeAndLimit ()
    - renderList ()
    - renderTextLists ()
    - moveToFavorites ()
    - moveToHistory ()
    - initializeTextLists ()
- initializePanelToggles ()
  - initializeDelimiterInput ()
- prepareCanvas (src/visualization/canvas.ts)
- getHannWindow (src/visualization/fft.ts)
  - fftRadix2 ()
    - getMaxFreqByThreshold (src/visualization/fftMaxFreq.ts)
- drawRealtimeFFT ()
  - getTopFreqInfo ()
    - findPeakPosition ()
    - drawPeakLine ()
    - drawFFTLine ()
    - drawTopBinLine ()
    - drawPeakLabel ()
    - xToFreq ()
    - freqToBinF ()
    - getInterpolatedValue ()
    - fftValueToY ()
- lerpColor (src/visualization/spectrogram.ts)
  - mapIntensityToSpectrogramColor ()
    - determineSpectrogramCeiling ()
    - analyzeSpectrogramFrames ()
    - drawSpectrogram ()
    - drawSpectrogramColumn ()
    - drawOfflineSpectrogram ()
    - computeAudioContentHash ()
    - buildSpectrogramSignature ()
    - processChunk ()
    - drawTimeTicks ()
- getSpectrogramScale (src/visualization/spectrogramCache.ts)
  - setSpectrogramScale ()
    - requestSpectrogramReset ()
    - createSpectrogramImageCache ()
    - analyzeAndCacheSpectrogram ()
    - handleSpectrogramInitialization ()
    - resetSpectrogramCaches ()
    - requestSpectrogramDraw ()
- formatTimeLabel (src/visualization/timeAxis.ts)
  - buildTimeTicks ()
- computeSegmentStats (src/visualization/waveform.ts)
  - computeSegmentCorrelation ()
    - extractAlignedRealtimeSegment ()
    - drawRealtimeWaveformBackground ()
    - drawRealtimeWaveformOnly ()
- clearWaveformCanvas ()
  - setProgressPosition ()
    - updateProgressLines ()
    - clearProgressLines ()
    - drawRealtimeVisuals ()
    - handleSpectrogramDraw ()
    - cleanupPlayback ()
    - render ()
    - finalize ()
    - stopPlayback ()
    - initializeSpectrogramScaleToggle ()
    - updateLabel ()
- handleReset (src/playback/confirmDialog.ts)
- makeDOM (src/playback.truncation.test.ts)
- triggerPlay (src/playback.ts)
- saveDelimiter (src/uiControls.ts)

---
Generated at: 2026-03-10 07:05:07 JST
