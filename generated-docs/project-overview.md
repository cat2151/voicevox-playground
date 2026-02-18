Last updated: 2026-02-19

# Project Overview

## プロジェクト概要
-   VOICEVOXローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。
-   多様なVOICEVOXキャラクターの音声で、任意のテキストを簡単に読み上げ、イントネーション調整も可能です。
-   手軽にVOICEVOXクライアントを試せるデモ環境を提供し、迅速な音声再生体験を実現します。

## 技術スタック
-   フロントエンド:
    -   TypeScript: JavaScriptに型安全性をもたらし、大規模なアプリケーション開発を支援する言語です。
-   音楽・オーディオ:
    -   Tone.js v15: ブラウザ上で高度なオーディオ処理やシンセシスを実現するためのJavaScriptフレームワーク。VOICEVOXから取得した音声データの再生と処理に利用されます。
    -   VOICEVOX API: VOICEVOXエンジンと連携し、テキストから音声データを生成（音声合成クエリの取得、音声データの合成）するためのHTTP API。
-   開発ツール:
    -   Vite: 高速な開発サーバーとバンドルを提供する次世代フロントエンドビルドツール。開発体験を向上させます。
    -   jsdom: Node.js環境でWebブラウザのDOM（Document Object Model）をエミュレートするライブラリ。主にテスト環境の構築に使用されます。
    -   @types/jsdom: jsdomライブラリのためのTypeScript型定義ファイル。
-   テスト:
    -   Vitest: Viteを基盤とした、高速でモダンなユニットテストフレームワーク。アプリケーションの各種機能のテストに使用されます。
-   ビルドツール:
    -   Vite: 開発ツールとしても機能しますが、本番環境向けのバンドル生成にも使用されます。
-   言語機能:
    -   TypeScript: 静的型付けにより、開発効率とコード品質を向上させるJavaScriptのスーパーセット言語です。
-   自動化・CI/CD:
    -   (該当する情報はありません)
-   開発標準:
    -   @biomejs/biome: コードのフォーマット、リンティング、LSP（Language Server Protocol）機能を提供する統合開発ツール。プロジェクト全体のコード品質と統一性を維持するために導入されています。

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
  📖 110.md
  📖 111.md
  📖 113.md
  📖 115.md
  📖 116.md
  📖 117.md
  📖 118.md
  📖 119.md
  📖 120.md
  📖 121.md
  📖 122.md
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
  📖 97.md
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
    📘 fftMaxFreq.ts
    📘 fftOverlay.test.ts
    📘 fftOverlay.ts
    📘 fftUtils.ts
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
-   **index.html**: プロジェクトのエントリーポイントとなるHTMLファイル。Webアプリケーションの骨格を定義し、主要なJavaScriptファイルを読み込みます。
-   **src/audio.ts**: VOICEVOX APIとの連携を担当し、音声合成クエリの取得、音声データの合成、および音声バッファの結合やWAVエンコードなどのオーディオ処理ロジックを提供します。
-   **src/config.ts**: アプリケーション全体で使用される各種設定（APIエンドポイント、デフォルト値など）を定義するファイル。
-   **src/intonation.test.ts**: `src/intonation.ts`で定義されたイントネーション関連機能のユニットテストを記述したファイル。
-   **src/intonation.ts**: 音声のイントネーション編集に関する主要なロジックを管理するファイル。イントネーションの読み込み、保存、編集、表示、キーボード操作ハンドリング、お気に入り機能などを担当します。
-   **src/intonationDisplay.ts**: イントネーション編集画面における表示関連のロジック（ピッチ範囲の計算、描画範囲の調整、グラフの描画、インタラクション時の表示更新など）を管理します。
-   **src/intonationPlayback.ts**: イントネーション編集後の音声再生ロジックを管理します。キャッシュされた音声の再生や、更新されたイントネーションでの音声の再フェッチ・再生などを担当します。
-   **src/intonationState.ts**: イントネーションの現在の状態（タイミング、編集フラグなど）を管理および更新するファイル。
-   **src/intonationUtils.ts**: イントネーション関連のユーティリティ関数（AudioQueryの形状バリデーション、クローンなど）を提供するファイル。
-   **src/main.ts**: アプリケーションのメインエントリファイル。各種コンポーネントの初期化、イベントリスナーの設定、スタイル選択の適用、スペクトログラム表示の更新など、UIとロジックの連携を調整します。
-   **src/playback.test.ts**: `src/playback.ts`で定義された音声再生機能のユニットテストを記述したファイル。
-   **src/playback.ts**: 音声再生に関する中心的なロジックを管理するファイル。再生ボタンの操作、再生要求の処理、音声のダウンロード、自動再生、リアルタイム波形クリアなどを担当します。
-   **src/state.ts**: アプリケーション全体のグローバルな状態を管理するファイル。
-   **src/status.ts**: アプリケーションのステータス表示（メッセージ、ローディングインジケーターなど）を管理するファイル。
-   **src/styleManager.test.ts**: `src/styleManager.ts`で定義されたスタイル管理機能のユニットテストを記述したファイル。
-   **src/styleManager.ts**: VOICEVOXのスタイル（キャラクター、話者スタイル）の取得、選択、管理に関するロジックを担うファイル。UIのスタイル選択ドロップダウンの生成も行います。
-   **src/styles/base.css**: アプリケーション全体の基本的なレイアウト、色、フォントなどの共通スタイルを定義するCSSファイル。
-   **src/styles/intonation.css**: イントネーション編集画面に特化したスタイルを定義するCSSファイル。
-   **src/styles.css**: 主要なスタイルシートをインポートするか、あるいは少量のグローバルスタイルを定義するファイル。
-   **src/textLists.test.ts**: `src/textLists.ts`で定義されたテキストリスト管理機能のユニットテストを記述したファイル。
-   **src/textLists.ts**: ユーザーが入力したテキストの履歴やお気に入りリストを管理するロジックを提供するファイル。データの永続化やリストのレンダリングを行います。
-   **src/uiControls.ts**: UIの特定のコントロール（例: エクスポートボタンの状態）を更新する小さなユーティリティ関数を含むファイル。
-   **src/visualization/canvas.ts**: HTML `<canvas>`要素の準備と基本的な操作に関するユーティリティ関数を提供するファイル。
-   **src/visualization/fft.ts**: 高速フーリエ変換（FFT）のアルゴリズム実装や、ハニング窓関数の生成など、FFT計算のコアロジックを担うファイル。
-   **src/visualization/fftMaxFreq.ts**: FFT結果から特定の閾値に基づいて最大周波数を検出するロジックを提供するファイル。
-   **src/visualization/fftOverlay.test.ts**: `src/visualization/fftOverlay.ts`で定義されたFFTオーバーレイ描画機能のユニットテストを記述したファイル。
-   **src/visualization/fftOverlay.ts**: リアルタイムFFT（周波数スペクトル）の描画ロジックを担当するファイル。ピーク周波数や特定の周波数帯の視覚化を行います。
-   **src/visualization/fftUtils.ts**: FFT関連のユーティリティ関数（周波数とビンインデックスの変換、FFT値からY座標への変換など）を提供するファイル。
-   **src/visualization/spectrogram.ts**: 音声のスペクトログラム（時間-周波数-強度グラフ）の計算と描画ロジックを管理するファイル。オフラインスペクトログラムの生成や色のマッピングを行います。
-   **src/visualization/timeAxis.ts**: スペクトログラムや波形表示における時間軸の描画ロジック（時刻ラベルのフォーマット、ティックの生成など）を担当するファイル。
-   **src/visualization/waveform.ts**: 音声波形の描画ロジックを管理するファイル。リアルタイム波形やレンダリング済み波形の描画、セグメントの統計計算などを担当します。
-   **src/visualization.test.ts**: `src/visualization.ts`で定義された可視化機能全体のユニットテストを記述したファイル。
-   **src/visualization.ts**: 音声のリアルタイム可視化（波形、スペクトログラム、FFT）に関する主要なロジックを統括するファイル。初期化、描画、再生との連携、クリーンアップなどを担当します。
-   **src/vite-env.d.ts**: Vite環境固有の型定義ファイル。
-   **tsconfig.json**: TypeScriptコンパイラの設定ファイル。コンパイルオプションなどを定義します。
-   **vite.config.ts**: Viteのビルド設定ファイル。プラグイン、エイリアス、出力オプションなどを定義します。

## 関数詳細説明
-   **getAudioQuery (src/audio.ts)**: VOICEVOX APIからテキストに対する音声合成クエリを取得します。
-   **synthesize (src/audio.ts)**: 取得した音声合成クエリを使用して、VOICEVOX APIから実際の音声データ（WAV形式）を合成・取得します。
-   **combineAudioBuffers (src/audio.ts)**: 複数のオーディオバッファを結合し、一つのオーディオバッファを作成します。
-   **encodeAudioBufferToWav (src/audio.ts)**: オーディオバッファをWAV形式のBlobデータにエンコードします。
-   **writeString (src/audio.ts)**: 文字列データを出力するための処理（ファイルへの書き込みなど）を行います。
-   **clamp (src/audio.ts)**: 数値を指定された最小値と最大値の範囲内に制限します。
-   **dedupeIntonationFavorites (src/intonation.ts)**: イントネーションのお気に入りリストから重複する項目を削除します。
-   **loadIntonationFavorites (src/intonation.ts)**: ローカルストレージなどからイントネーションのお気に入りリストを読み込みます。
-   **persistIntonationFavorites (src/intonation.ts)**: イントネーションのお気に入りリストをローカルストレージなどに保存します。
-   **disableLoopOnIntonationEdit (src/intonation.ts)**: イントネーション編集操作時にループ再生を無効にする処理を行います。
-   **resetIntonationState (src/intonation.ts)**: イントネーションの現在の状態を初期値にリセットします。
-   **setStyleChangeHandler (src/intonation.ts)**: スタイル変更イベントが発生した際のハンドラー関数を設定します。
-   **initializeIntonationElements (src/intonation.ts)**: イントネーション編集UIに関連するHTML要素を初期化し、イベントリスナーを設定します。
-   **isIntonationDirty (src/intonation.ts)**: 現在のイントネーションデータが初期状態から変更されているか（ダーティ状態か）を判定します。
-   **setIntonationKeyboardEnabled (src/intonation.ts)**: イントネーション編集におけるキーボード操作の有効/無効を切り替えます。
-   **getIntonationKeyboardEnabled (src/intonation.ts)**: イントネーション編集用のキーボード操作が現在有効であるかを取得します。
-   **applyPitchToQuery (src/intonation.ts)**: ユーザーが編集したピッチ情報を音声合成クエリデータに適用します。
-   **applyPitchEdit (src/intonation.ts)**: UI上でのピッチ編集操作を処理し、イントネーションデータを更新します。
-   **handleIntonationPointerDown (src/intonation.ts)**: イントネーション編集グラフ上でのポインター（マウス/タッチ）押し下げイベントを処理します。
-   **handleIntonationPointerMove (src/intonation.ts)**: イントネーション編集グラフ上でのポインター移動イベントを処理します。
-   **handleIntonationPointerUp (src/intonation.ts)**: イントネーション編集グラフ上でのポインター離しイベントを処理します。
-   **handleIntonationKeyDown (src/intonation.ts)**: イントネーション編集UIがフォーカスされている際のキーボード入力イベントを処理します。
-   **renderIntonationFavoritesList (src/intonation.ts)**: イントネーションのお気に入りリストをUI要素として描画・更新します。
-   **removeIntonationFavorite (src/intonation.ts)**: イントネーションのお気に入りリストから指定された項目を削除します。
-   **applyIntonationFavorite (src/intonation.ts)**: お気に入りに保存されたイントネーション設定を現在の編集にロードして適用します。
-   **saveCurrentIntonationFavorite (src/intonation.ts)**: 現在編集中のイントネーション設定をお気に入りとして保存します。
-   **refreshIntonationChart (src/intonation.ts)**: イントネーションのグラフ表示を再描画し、最新の状態を反映させます。
-   **getPitchRange (src/intonationDisplay.ts)**: イントネーショングラフの表示に使用するピッチの最小値と最大値を計算します。
-   **calculateBasePadding (src/intonationDisplay.ts)**: イントネーショングラフの描画領域における基本的なパディングを計算します。
-   **getBaseDisplayRange (src/intonationDisplay.ts)**: イントネーショングラフの基本的な表示範囲（ピッチ、時間など）を計算します。
-   **calculateDisplayRange (src/intonationDisplay.ts)**: イントネーショングラフの具体的な表示範囲を、現在のズームレベルやスクロール位置に基づいて計算します。
-   **clampRangeExtra (src/intonationDisplay.ts)**: 表示範囲の追加調整値が適切な範囲内に収まるように制限します。
-   **applyRangeExtra (src/intonationDisplay.ts)**: 計算された追加の表示範囲調整をグラフに適用します。
-   **refreshDisplayRange (src/intonationDisplay.ts)**: イントネーショングラフの表示範囲を更新し、再描画をトリガーします。
-   **clampPitchToDisplayRange (src/intonationDisplay.ts)**: ピッチ値をグラフの表示可能な範囲に制限します。
-   **calculateStepSize (src/intonationDisplay.ts)**: イントネーション編集におけるピッチ調整のステップサイズを計算します。
-   **calculateLetterKeyAdjustment (src/intonationDisplay.ts)**: キーボードの文字キーによるピッチ調整量を計算します。
-   **handleIntonationWheel (src/intonationDisplay.ts)**: イントネーショングラフ上でのマウスホイールイベント（ズームイン/アウト、スクロールなど）を処理します。
-   **ensureWheelHandler (src/intonationDisplay.ts)**: ホイールイベントハンドラーがイントネーショングラフのキャンバスに適切に設定されていることを確認します。
-   **updateInitialRangeFromPoints (src/intonationDisplay.ts)**: イントネーションポイントのデータに基づいて、グラフの初期表示範囲を更新します。
-   **initializeIntonationCanvas (src/intonationDisplay.ts)**: イントネーション描画用のHTML Canvas要素を初期化し、描画コンテキストを設定します。
-   **buildIntonationPointsFromQuery (src/intonationDisplay.ts)**: VOICEVOXのAudioQueryデータからイントネーショングラフの描画に必要なポイントデータを構築します。
-   **renderIntonationLabels (src/intonationDisplay.ts)**: イントネーショングラフの軸に時間やピッチのラベルを描画します。
-   **drawIntonationChart (src/intonationDisplay.ts)**: イントネーションのピッチ曲線や背景、グリッドなどをキャンバスに描画します。
-   **adjustIntonationScale (src/intonationDisplay.ts)**: イントネーショングラフの垂直方向のスケール（拡大・縮小）を調整します。
-   **pitchFromY (src/intonationDisplay.ts)**: キャンバス上のY座標から対応するピッチ値に変換します。
-   **findNearestIntonationPoint (src/intonationDisplay.ts)**: 指定されたキャンバス座標に最も近いイントネーション編集ポイントを見つけます。
-   **scheduleIntonationPlayback (src/intonationPlayback.ts)**: イントネーション編集後の音声再生をスケジュールし、再生準備を行います。
-   **replayCachedIntonationAudio (src/intonationPlayback.ts)**: 既にキャッシュされているイントネーションの音声データを再再生します。
-   **showPlaybackStatus (src/intonationPlayback.ts)**: 音声再生中のステータス（例: 読み込み中、再生中）をUIに表示します。
-   **playUpdatedIntonation (src/intonationPlayback.ts)**: 更新されたイントネーション設定に基づいて音声を合成・再生します。
-   **fetchAndRenderIntonation (src/intonationPlayback.ts)**: VOICEVOX APIからイントネーションデータを取得し、それをグラフとしてレンダリングします。
-   **resetIntonationToInitial (src/intonationPlayback.ts)**: イントネーションの設定を初期状態に戻します。
-   **updateIntonationTiming (src/intonationState.ts)**: イントネーションの各音素のタイミング情報を更新します。
-   **isValidAudioQueryShape (src/intonationUtils.ts)**: AudioQueryオブジェクトのデータ構造が期待される形式に合致しているかを検証します。
-   **cloneAudioQuery (src/intonationUtils.ts)**: AudioQueryオブジェクトを完全に独立したコピーとして生成します。
-   **applyStyleSelection (src/main.ts)**: UIで選択されたスタイル（キャラクター、話者）をアプリケーション全体に適用し、関連するUIを更新します。
-   **applyRandomStyleSelection (src/main.ts)**: ランダムなスタイルをアプリケーションに適用します。
-   **saveDelimiter (src/main.ts)**: テキスト入力で使用される区切り文字の設定を保存します。
-   **scheduleSaveDelimiter (src/main.ts)**: テキスト区切り文字設定の保存処理を遅延実行するようにスケジュールします。
-   **updateSpectrogramScaleLabel (src/main.ts)**: スペクトログラムの表示スケールを示すUIラベルを更新します。
-   **updateIntonationKeyboardToggle (src/main.ts)**: イントネーション編集用のキーボード操作を有効/無効にするトグルボタンのUI状態を更新します。
-   **setLoopCheckboxElement (src/playback.ts)**: 音声のループ再生を制御するチェックボックスのDOM要素を設定します。
-   **setPlayButtonAppearance (src/playback.ts)**: 再生ボタンの見た目（再生中、一時停止中、ロード中など）を更新します。
-   **isPlayRequestPending (src/playback.ts)**: 現在、音声再生リクエストが処理中であるか（サーバーからの音声データ待ちなど）を判定します。
-   **stopPlaybackAndResetLoop (src/playback.ts)**: 現在の音声再生を停止し、ループ再生設定を解除します。
-   **getAudioCacheKey (src/playback.ts)**: 音声データをキャッシュするために使用する一意のキーを生成します。
-   **setTextAndPlay (src/playback.ts)**: 指定されたテキストを読み上げ、直ちに音声を再生します。
-   **downloadLastAudio (src/playback.ts)**: 最後に再生された音声データをユーザーのデバイスにダウンロードさせます。
-   **scheduleAutoPlay (src/playback.ts)**: アプリケーション起動時や特定イベント後に自動的に音声を再生するようスケジュールします。
-   **confirmResetIntonationBeforePlay (src/playback.ts)**: 再生前にイントネーションが編集されている場合、リセットするかどうかの確認ダイアログを表示します。
-   **handlePlayButtonClick (src/playback.ts)**: UIの再生ボタンがクリックされたときのイベントを処理し、再生ロジックをトリガーします。
-   **handlePlay (src/playback.ts)**: 実際の音声合成と再生の中核的なロジックを処理します。
-   **clearRealtimeWaveformCanvas (src/playback.ts)**: リアルタイムで描画される波形キャンバスの内容をクリアします。
-   **triggerPlay (src/playback.ts)**: 音声再生の処理を開始します。
-   **cleanup (src/playback.ts)**: 音声再生が終了した後の後処理（リソース解放、UI状態のリセットなど）を行います。
-   **handleReset (src/playback.ts)**: UIのリセットボタンがクリックされたときのイベントを処理し、アプリケーションの状態を初期化します。
-   **handleCancel (src/playback.ts)**: UIのキャンセルボタンがクリックされたときのイベントを処理します。
-   **showStatus (src/status.ts)**: アプリケーションの画面上に一時的なステータスメッセージやローディングインジケーターを表示します。
-   **hideStatus (src/status.ts)**: 表示されているステータスメッセージやローディングインジケーターを非表示にします。
-   **scheduleHideStatus (src/status.ts)**: 指定された時間（ミリ秒）が経過した後にステータスメッセージを非表示にするようスケジュールします。
-   **invalidateColorVariableCache (src/status.ts)**: CSSカスタムプロパティから取得した色変数のキャッシュを無効化します。
-   **getColorVariable (src/status.ts)**: CSSカスタムプロパティ（CSS変数）から指定された色変数の値を取得します。
-   **getSelectedStyleId (src/styleManager.ts)**: 現在UIで選択されているVOICEVOXのスタイルIDを取得します。
-   **setSelectedStyleId (src/styleManager.ts)**: 指定されたスタイルIDを選択状態に設定し、関連するUI要素（ドロップダウンなど）を更新します。
-   **selectRandomStyleId (src/styleManager.ts)**: 利用可能なスタイルの中からランダムに一つを選択します。
-   **getStyleLabel (src/styleManager.ts)**: スタイルIDに対応するユーザーフレンドリーな表示ラベル（例: キャラクター名と話者スタイル）を取得します。
-   **getStyleById (src/styleManager.ts)**: 指定されたIDに対応する詳細なスタイル情報を取得します。
-   **getSpeakerStylesByStyleId (src/styleManager.ts)**: 指定されたスタイルIDに関連する複数の話者スタイル（例: 喜、怒、哀、楽）のリストを取得します。
-   **resolveStyleMarker (src/styleManager.ts)**: スタイルマーカー（例: VOICEVOX APIから取得するスタイルの内部ID）を解決し、実際のスタイル情報に紐付けます。
-   **parseDelimiterConfig (src/styleManager.ts)**: テキストのセグメンテーションに使用する区切り文字の設定を解析します。
-   **addSegment (src/styleManager.ts)**: テキストをスタイルに基づいて分割したセグメントリストに、新しいセグメントを追加します。
-   **buildTextSegments (src/styleManager.ts)**: 入力されたテキストを、スタイルや区切り文字の設定に基づいて複数のセグメントに分割します。
-   **populateStyleSelect (src/styleManager.ts)**: UIのスタイル選択ドロップダウンメニューに、利用可能なスタイルオプションを動的に追加します。
-   **populateSpeakerStyleSelect (src/styleManager.ts)**: UIのスピカースタイル選択ドロップダウンメニューに、利用可能なスタイルオプションを動的に追加します。
-   **fetchVoiceStyles (src/styleManager.ts)**: VOICEVOX APIから利用可能なすべての音声スタイル（キャラクターや話者スタイル）のリストを取得します。
-   **loadStoredList (src/textLists.ts)**: ローカルストレージなど永続化された場所から、テキストのリスト（お気に入りや履歴）を読み込みます。
-   **persistList (src/textLists.ts)**: 指定されたテキストリストをローカルストレージなどの永続化された場所に保存します。
-   **persistLists (src/textLists.ts)**: 複数のテキストリスト（例: お気に入りリストと履歴リスト）をまとめて永続化します。
-   **dedupeAndLimit (src/textLists.ts)**: テキストリスト内の重複する項目を削除し、リストの最大項目数を制限します。
-   **renderList (src/textLists.ts)**: 指定されたテキストリストの項目をUI要素として描画・更新します。
-   **renderTextLists (src/textLists.ts)**: すべてのテキストリスト（お気に入り、履歴など）をUI上に描画します。
-   **moveToFavorites (src/textLists.ts)**: 履歴リスト内のテキスト項目をお気に入りリストに移動します。
-   **moveToHistory (src/textLists.ts)**: お気に入りリスト内のテキスト項目を履歴リストに移動します。
-   **addToHistory (src/textLists.ts)**: 新しいテキスト項目を履歴リストに追加します。
-   **initializeTextLists (src/textLists.ts)**: テキストリストの管理機能を初期化し、既存のデータをロードしてUIに表示します。
-   **updateExportButtonState (src/uiControls.ts)**: 音声のエクスポートボタンの有効/無効状態を、現在のアプリケーションの状態に基づいて更新します。
-   **prepareCanvas (src/visualization/canvas.ts)**: HTML `<canvas>`要素を初期設定し、2D描画コンテキストを取得して描画準備を行います。
-   **getHannWindow (src/visualization/fft.ts)**: スペクトル分析の際に使用するハニング窓関数（重み付け関数）の配列を生成します。
-   **fftRadix2 (src/visualization/fft.ts)**: ラディックス2アルゴリズムに基づく高速フーリエ変換（FFT）を実行し、時間領域の信号を周波数領域に変換します。
-   **getMaxFreqByThreshold (src/visualization/fftMaxFreq.ts)**: FFT結果から、指定された強度閾値を超える周波数の中で最も高いものを検出します。
-   **drawRealtimeFFT (src/visualization/fftOverlay.ts)**: リアルタイムで取得された音声データから計算されたFFTスペクトルをキャンバスに描画します。
-   **getTopFreqInfo (src/visualization/fftOverlay.ts)**: FFTデータの中から、最も支配的な（高いエネルギーを持つ）周波数に関する情報を抽出します。
-   **findPeakPosition (src/visualization/fftOverlay.ts)**: FFTスペクトル内で最も強度が大きい周波数（ピーク）の位置を検出します。
-   **drawPeakLine (src/visualization/fftOverlay.ts)**: スペクトル上で検出されたピーク周波数の位置を示す垂直線を描画します。
-   **drawFFTLine (src/visualization/fftOverlay.ts)**: FFTスペクトルの周波数-強度曲線を描画します。
-   **drawTopBinLine (src/visualization/fftOverlay.ts)**: FFTで最も高い強度を持つビン（周波数帯）を示す線を描画します。
-   **drawPeakLabel (src/visualization/fftOverlay.ts)**: 検出されたピーク周波数の値（Hz）をグラフ上にラベルとして描画します。
-   **xToFreq (src/visualization/fftUtils.ts)**: キャンバス上のX座標を対応する周波数値に変換します。
-   **freqToBinF (src/visualization/fftUtils.ts)**: 周波数値をFFTのビンインデックスに変換します。
-   **getInterpolatedValue (src/visualization/fftUtils.ts)**: データポイント間で線形補間を行い、補間された値を取得します。
-   **fftValueToY (src/visualization/fftUtils.ts)**: FFTの振幅値（強度）をキャンバスのY座標に変換します。
-   **lerpColor (src/visualization/spectrogram.ts)**: 2つの色間で線形補間を行い、グラデーションを生成します。
-   **mapIntensityToSpectrogramColor (src/visualization/spectrogram.ts)**: 音声の強度値をスペクトログラムの視覚的な色にマッピングします。
-   **determineSpectrogramCeiling (src/visualization/spectrogram.ts)**: スペクトログラムのカラーマッピングにおける強度の上限値を決定します。
-   **analyzeSpectrogramFrames (src/visualization/spectrogram.ts)**: 音声データを時間的に区切られたフレームごとに分析し、各フレームの周波数スペクトルデータを生成します。
-   **drawSpectrogram (src/visualization/spectrogram.ts)**: 音声全体のスペクトログラムをキャンバスに描画します。
-   **drawSpectrogramColumn (src/visualization/spectrogram.ts)**: スペクトログラムの1つの時間フレーム（縦の列）をキャンバスに描画します。
-   **drawOfflineSpectrogram (src/visualization/spectrogram.ts)**: リアルタイムではなく、事前に計算された音声データに基づいてスペクトログラムを描画します。
-   **computeAudioContentHash (src/visualization/spectrogram.ts)**: オーディオコンテンツのハッシュ値を計算し、キャッシュキーなどに利用します。
-   **buildSpectrogramSignature (src/visualization/spectrogram.ts)**: スペクトログラムを識別するための一意のシグネチャ（特徴量）を構築します。
-   **processChunk (src/visualization/spectrogram.ts)**: 音声データの小分けされたチャンク（断片）を処理し、スペクトログラム分析に供します。
-   **formatTimeLabel (src/visualization/timeAxis.ts)**: 時間値（秒）を、`mm:ss`のような人間が読みやすい形式のラベルに整形します。
-   **buildTimeTicks (src/visualization/timeAxis.ts)**: 時間軸に表示する目盛り（ティックマーク）の位置とラベルを計算します。
-   **drawTimeTicks (src/visualization/timeAxis.ts)**: 計算された時間軸の目盛りをキャンバスに描画します。
-   **computeSegmentStats (src/visualization/waveform.ts)**: 波形データの特定のセグメント（区間）における統計情報（例: 平均振幅、RMS）を計算します。
-   **computeSegmentCorrelation (src/visualization/waveform.ts)**: 複数の波形セグメント間の類似度（相関）を計算します。
-   **extractAlignedRealtimeSegment (src/visualization/waveform.ts)**: リアルタイムで取得している波形データから、特定の時間に整列されたセグメントを抽出します。
-   **drawRenderedWaveform (src/visualization/waveform.ts)**: 合成済み（レンダリング済み）の音声波形データをキャンバスに描画します。
-   **drawRealtimeWaveformBackground (src/visualization/waveform.ts)**: リアルタイム波形表示領域の背景（グリッド、枠線など）を描画します。
-   **drawRealtimeWaveformOnly (src/visualization/waveform.ts)**: リアルタイムで入力される音声の波形データのみをキャンバスに描画します。
-   **getSpectrogramScale (src/visualization.ts)**: スペクトログラムの現在の表示スケール（例: 周波数範囲、時間範囲）を取得します。
-   **setSpectrogramScale (src/visualization.ts)**: スペクトログラムの表示スケールを設定し、表示を更新します。
-   **requestSpectrogramReset (src/visualization.ts)**: スペクトログラムの表示をリセットし、再初期化を要求します。
-   **isPlaybackActive (src/visualization.ts)**: 現在、音声が再生中であるかを判定します。
-   **stopActivePlayback (src/visualization.ts)**: アクティブな音声再生を停止します。
-   **initializeVisualizationCanvases (src/visualization.ts)**: 音声可視化に使用されるすべてのHTML Canvas要素を初期化し、描画準備を行います。
-   **clearWaveformCanvas (src/visualization.ts)**: 波形描画用のキャンバスの内容をクリアします。
-   **createSpectrogramImageCache (src/visualization.ts)**: スペクトログラムの描画結果をキャッシュするための画像オブジェクトを生成します。
-   **analyzeAndCacheSpectrogram (src/visualization.ts)**: 音声データを分析してスペクトログラムを生成し、その結果をキャッシュします。
-   **handleSpectrogramInitialization (src/visualization.ts)**: スペクトログラム表示の初期化に関する処理（データロード、初回描画など）をハンドルします。
-   **playAudio (src/visualization.ts)**: 音声データを再生します。
-   **setProgressPosition (src/visualization.ts)**: 可視化上の再生プログレスバーの位置を更新します。
-   **updateProgressLines (src/visualization.ts)**: 再生進行を示すプログレスラインの表示を更新します。
-   **clearProgressLines (src/visualization.ts)**: 再生進行を示すプログレスラインの表示をクリアします。
-   **drawRealtimeVisuals (src/visualization.ts)**: リアルタイムの音声データに基づいて、波形やFFTなどの可視化要素を描画します。
-   **handleSpectrogramDraw (src/visualization.ts)**: スペクトログラムの描画処理を管理し、必要な描画更新を行います。
-   **cleanupPlayback (src/visualization.ts)**: 音声再生終了後、可視化に関連するリソースのクリーンアップ処理を行います。
-   **requestSpectrogramDraw (src/visualization.ts)**: スペクトログラムの描画更新を要求します。
-   **render (src/visualization.ts)**: 可視化のメインループで各要素を描画します。
-   **finalize (src/visualization.ts)**: 可視化処理の最終段階で、表示の確定やリソース解放を行います。
-   **stopPlayback (src/visualization.ts)**: 可視化に関連するすべての音声再生を停止します。

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
      - showPlaybackStatus ()
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
      - isPlaybackActive ()
  - stopPlaybackAndResetLoop ()
    - getAudioCacheKey ()
      - setTextAndPlay ()
      - downloadLastAudio ()
      - scheduleAutoPlay ()
      - confirmResetIntonationBeforePlay ()
      - handlePlayButtonClick ()
      - clearRealtimeWaveformCanvas ()
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
  - formatTimeLabel (src/visualization/timeAxis.ts)
    - buildTimeTicks ()
  - computeSegmentStats (src/visualization/waveform.ts)
    - computeSegmentCorrelation ()
      - extractAlignedRealtimeSegment ()
      - drawRealtimeWaveformBackground ()
      - drawRealtimeWaveformOnly ()
  - catch (src/audio.ts)
  - requestSpectrogramReset ()
    - clearWaveformCanvas ()
      - createSpectrogramImageCache ()
      - analyzeAndCacheSpectrogram ()
      - handleSpectrogramInitialization ()
      - setProgressPosition ()
      - updateProgressLines ()
      - clearProgressLines ()
      - drawRealtimeVisuals ()
      - handleSpectrogramDraw ()
      - cleanupPlayback ()
      - requestSpectrogramDraw ()
      - render ()
      - finalize ()
      - stopPlayback ()
- for (src/audio.ts)
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)
- while (src/styleManager.ts)

---
Generated at: 2026-02-19 07:07:08 JST
