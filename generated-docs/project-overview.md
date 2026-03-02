Last updated: 2026-03-03

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、Webブラウザからテキストを音声に変換して再生するアプリケーションです。
- ユーザーはテキスト入力やイントネーション調整を通じて、多様なキャラクターの音声での読み上げを体験できます。
- VOICEVOXクライアントアプリの容易な開発実証と、即座な音声再生体験の提供を目指しています。

## 技術スタック
- フロントエンド:
    - **TypeScript**: JavaScriptに静的型付けを追加し、大規模なWebアプリケーション開発の堅牢性と保守性を向上させます。
    - **Vite**: 最新のWebプロジェクト向けに、超高速な開発サーバーと効率的なビルドプロセスを提供するフロントエンドビルドツールです。
    - **HTML/CSS**: ウェブページの構造を定義し、視覚的なスタイリングを適用するための基盤技術です。
- 音楽・オーディオ:
    - **Tone.js v15**: ブラウザ上で高度なオーディオ処理、合成、エフェクトを可能にするJavaScriptフレームワークです。
    - **VOICEVOX API**: VOICEVOXエンジンと連携し、テキストから高品質な音声合成機能を提供します。
- 開発ツール:
    - **@biomejs/biome**: コードのフォーマットとリンティングを統合し、開発標準の統一と品質向上を支援するツールです。
    - **jsdom**: Node.js環境でWebブラウザのDOM（Document Object Model）をエミュレートし、サーバーサイドでのDOM操作を可能にします。
    - **@types/jsdom**: jsdomライブラリのTypeScript型定義ファイルで、型安全な開発をサポートします。
- テスト:
    - **Vitest**: Viteをベースにした高速なテストフレームワークで、効率的なユニットテストとコンポーネントテストを可能にします。
- ビルドツール:
    - **Vite**: フロントエンドの開発サーバーとして機能するだけでなく、本番環境向けの最適化されたJavaScript、CSS、HTMLのビルドを行います。
- 言語機能:
    - **TypeScript**: JavaScriptのスーパーセットとして、型の導入によりコードの可読性と保守性を高め、開発時のエラーを早期に検出します。
- 自動化・CI/CD:
    - **GitHub Actions**: (README翻訳に利用) コード変更時に自動でテスト、ビルド、デプロイなどのワークフローを実行し、開発プロセスを効率化します。
- 開発標準:
    - **@biomejs/biome**: コードスタイルの一貫性を保ち、潜在的な問題を指摘することで、チーム開発におけるコード品質を維持・向上させます。

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
  📖 123.md
  📖 138.md
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
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📘 intonation.test.ts
  📘 intonation.ts
  📘 intonationDisplay.ts
  📘 intonationHandlers.ts
  📘 intonationPlayback.ts
  📘 intonationState.ts
  📘 intonationUtils.ts
  📘 main.ts
  📘 playback.test.ts
  📘 playback.ts
  📘 settings.test.ts
  📘 settings.ts
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
- **index.html**: アプリケーションのエントリーポイントとなるHTMLファイルです。Webページの基本的な構造、メインのUI要素、およびスクリプトの読み込みを定義しています。
- **src/audio.ts**: VOICEVOX APIと連携し、音声クエリの生成、音声データの合成、複数のオーディオバッファの結合、WAV形式へのエンコードなど、オーディオ関連の低レベルな処理を抽象化して提供します。
- **src/config.ts**: VOICEVOX APIのエンドポイントURLや、アプリケーションの動作に必要な各種設定値、定数を一元的に管理しています。
- **src/intonation.test.ts**: イントネーション調整機能に関するユニットテストを記述しており、機能の正確性を検証します。
- **src/intonation.ts**: イントネーションの管理、お気に入り機能、UIイベントハンドリング、イントネーション調整状態の制御など、イントネーション調整機能の中核をなすロジックが含まれています。
- **src/intonationDisplay.ts**: イントネーションチャートの描画、表示範囲の計算、ピッチ調整のためのUI更新、ラベル表示など、イントネーションの視覚化とユーザーインタラクションに関する処理を担当します。
- **src/intonationHandlers.ts**: イントネーションチャート上でのポインタ操作（クリック、ドラッグ）やキーボード操作など、ユーザーの入力イベントを処理し、イントネーション調整ロジックに連携します。
- **src/intonationPlayback.ts**: イントネーション調整後の音声再生、再生キューのスケジュール管理、音声データのキャッシュ、再生ステータスの表示など、調整された音声の再生に関する機能を提供します。
- **src/intonationState.ts**: イントネーションの現在の状態、特にタイミング情報など、イントネーション調整に必要な状態変数を管理します。
- **src/intonationUtils.ts**: オーディオクエリデータの検証やディープコピーなど、イントネーション関連のデータを操作するためのユーティリティ関数を提供します。
- **src/main.ts**: アプリケーション全体の初期化処理、各種設定のUIへの適用、スタイル選択、スペクトログラムスケールやイントネーションキーボードトグルの更新など、メインのアプリケーションロジックを管理します。
- **src/playback.test.ts**: 音声再生機能に関するユニットテストを記述しており、再生制御の正確性を検証します。
- **src/playback.ts**: 音声再生の開始・停止、ループ設定、オーディオデータのキャッシュ管理、音声ファイルのダウンロード、自動再生、再生前確認など、再生制御の主要な機能を提供します。
- **src/settings.test.ts**: アプリケーションの設定管理機能に関するユニットテストを記述しており、設定の読み込み、保存、リセットの正確性を検証します。
- **src/settings.ts**: VOICEVOX APIのポート、周波数パーセンテージなど、アプリケーションの永続的な設定の読み込み、保存、リセット、および各種設定値の取得・設定を行います。
- **src/state.ts**: アプリケーション全体で共有される軽量なグローバル状態を管理し、異なるモジュール間での情報共有を可能にします。
- **src/status.ts**: アプリケーションのユーザーインターフェースにステータスメッセージを表示・非表示にし、その表示をスケジュールする機能、およびCSSカスタムプロパティのキャッシュ管理を行います。
- **src/styleManager.test.ts**: 音声スタイル（キャラクター）の選択・管理機能に関するユニットテストを記述しており、スタイルの取得、選択、テキストへの適用などの正確性を検証します。
- **src/styleManager.ts**: VOICEVOXの音声スタイル（キャラクター）情報のフェッチ、選択されたスタイルのID管理、スタイルラベルやAPIベースURLの取得、テキストのセグメント化、UIへのスタイル選択肢の表示など、音声スタイルに関する全ての管理を行います。
- **src/styles/base.css**: アプリケーション全体の基本的なレイアウト、共通のスタイルルール、タイポグラフィ、カラーパレットなどを定義する基盤となるCSSファイルです。
- **src/styles/intonation.css**: イントネーション調整機能に特化したUI要素のスタイルを定義するCSSファイルです。
- **src/styles.css**: 他のCSSファイルをインポートしたり、アプリケーション全体に適用される追加のカスタムスタイルを定義したりするためのメインのスタイルシートです。
- **src/textLists.test.ts**: テキストのお気に入りや履歴リストの管理機能に関するユニットテストを記述しており、リストの読み込み、保存、操作の正確性を検証します。
- **src/textLists.ts**: ユーザーが入力したテキストのお気に入りリストと履歴リストを管理し、ローカルストレージへの永続化、リスト項目の表示、重複の削除、リスト間の移動などを行います。
- **src/uiControls.ts**: エクスポートボタンの有効/無効状態の更新など、UIコンポーネントのシンプルな状態変更や操作に関するヘルパー関数を提供します。
- **src/visualization/canvas.ts**: HTMLキャンバス要素の初期化やコンテキストの取得など、可視化を行うためのキャンバスの準備に関するユーティリティ関数を提供します。
- **src/visualization/fft.ts**: 高速フーリエ変換（FFT）アルゴリズムの実装と、ハン窓関数（Hann window）の生成など、周波数分析の基礎となる数学的処理を提供します。
- **src/visualization/fftMaxFreq.ts**: FFT結果から特定のしきい値に基づき、音声信号の主要な最大周波数を検出するロジックを提供します。
- **src/visualization/fftOverlay.test.ts**: FFTのリアルタイム可視化オーバーレイ機能に関するユニットテストを記述しており、描画の正確性を検証します。
- **src/visualization/fftOverlay.ts**: リアルタイムで音声のFFT（周波数スペクトル）をキャンバスに描画し、主要な周波数ピークの検出、ライン表示、ラベル表示など、視覚的なフィードバックを提供します。
- **src/visualization/fftUtils.ts**: 周波数とFFTのビン番号間の変換、値の補間、FFT値からY座標へのマッピングなど、FFTデータ処理に役立つユーティリティ関数を提供します。
- **src/visualization/spectrogram.ts**: 音声強度を色にマッピングし、スペクトログラムを生成・描画する主要なロジックを提供します。スペクトログラムの天井値の決定、フレーム分析、オフライン描画、ハッシュ計算などを含みます。
- **src/visualization/spectrogramCache.ts**: スペクトログラムのスケール管理、画像キャッシュの作成と管理、分析結果のキャッシュ、およびスペクトログラムの初期化とリセットに関する機能を提供し、パフォーマンスを向上させます。
- **src/visualization/timeAxis.ts**: 音声の再生時間を示す時間軸のラベルフォーマット、ティック（目盛り）の生成、およびキャンバス上への時間軸の描画ロジックを提供します。
- **src/visualization/waveform.ts**: 音声の波形セグメントの統計計算、相関分析、リアルタイム波形の抽出、およびレンダリングされた波形やリアルタイム波形の背景・本体の描画ロジックを提供します。
- **src/visualization.test.ts**: 可視化機能全般に関するユニットテストを記述しており、可視化の初期化、再生、停止などの正確性を検証します。
- **src/visualization.ts**: 音声の波形、スペクトログラム、リアルタイムFFTなど、複数の可視化要素の初期化、制御、描画を統合的に管理し、音声再生と連携したリアルタイムな視覚フィードバックを提供します。
- **src/vite-env.d.ts**: Vite環境変数に関するTypeScriptの型定義ファイルで、環境変数を型安全に利用できるようにします。
- **vite.config.ts**: Viteビルドツールの設定ファイルで、プロジェクトのビルドプロセス、開発サーバー、プラグインなどをカスタマイズします。

## 関数詳細説明
-   **getAudioQuery (src/audio.ts)**: VOICEVOX APIから音声合成に必要なクエリ（パラメータ）を取得します。入力テキストや選択されたスタイルに基づいて、APIリクエストを構築します。
-   **synthesize (src/audio.ts)**: 取得した音声クエリをVOICEVOX APIに送信し、実際に音声データを合成して取得します。
-   **combineAudioBuffers (src/audio.ts)**: 複数の個別のオーディオバッファを受け取り、それらを単一の連続したオーディオバッファに結合します。
-   **encodeAudioBufferToWav (src/audio.ts)**: Web Audio APIのAudioBufferオブジェクトを標準的なWAV形式のバイナリデータにエンコードします。
-   **writeString (src/audio.ts)**: 指定された文字列を、指定されたDataViewオブジェクトにバイト配列として書き込むユーティリティ関数です。
-   **clamp (src/audio.ts)**: 数値が指定された最小値と最大値の範囲内に収まるように制限（クランプ）します。
-   **dedupeIntonationFavorites (src/intonation.ts)**: イントネーションのお気に入りリストから重複するエントリを検出し、削除します。
-   **loadIntonationFavorites (src/intonation.ts)**: ローカルストレージから保存されているイントネーションのお気に入りリストを読み込みます。
-   **persistIntonationFavorites (src/intonation.ts)**: 現在のイントネーションのお気に入りリストをローカルストレージに保存し、永続化します。
-   **resetIntonationState (src/intonation.ts)**: イントネーション調整の状態を初期値またはデフォルト値にリセットします。
-   **setStyleChangeHandler (src/intonation.ts)**: 音声スタイルが変更された際に呼び出されるイベントハンドラを設定します。
-   **initializeIntonationElements (src/intonation.ts)**: イントネーション調整に関連するHTML要素やUIコンポーネントを初期化します。
-   **isIntonationDirty (src/intonation.ts)**: 現在のイントネーション設定が初期状態から変更されている（編集された）かどうかを判定します。
-   **isIntonationActive (src/intonation.ts)**: イントネーション調整機能が現在アクティブな状態であるかどうかを判定します。
-   **hasActiveIntonationQuery (src/intonation.ts)**: 現在、アクティブなイントネーションクエリ（音声合成のためのイントネーション情報）が存在するかどうかを判定します。
-   **setIntonationKeyboardEnabled (src/intonation.ts)**: イントネーション調整時のキーボードショートカット操作の有効/無効を切り替えます。
-   **getIntonationKeyboardEnabled (src/intonation.ts)**: イントネーション調整時のキーボードショートカット操作が現在有効であるかどうかを返します。
-   **renderIntonationFavoritesList (src/intonation.ts)**: イントネーションのお気に入りリストをWebページのUI上に描画または更新します。
-   **removeIntonationFavorite (src/intonation.ts)**: イントネーションのお気に入りリストから特定の項目を削除します。
-   **applyIntonationFavorite (src/intonation.ts)**: 保存されているお気に入りのイントネーション設定を現在の音声クエリに適用し、UIを更新します。
-   **saveCurrentIntonationFavorite (src/intonation.ts)**: 現在編集中のイントネーション設定を新しいお気に入りとして保存します。
-   **refreshIntonationChart (src/intonation.ts)**: イントネーションを示すグラフ（チャート）を最新の状態に基づいて再描画します。
-   **setupIntonationCanvasEvents (src/intonation.ts)**: イントネーション描画用のキャンバス要素に対するユーザーインタラクション（マウス、ポインタ、キーボード）イベントリスナーを設定します。
-   **getPitchRange (src/intonationDisplay.ts)**: イントネーションチャートで表示すべきピッチの範囲（最小値と最大値）を計算します。
-   **calculateBasePadding (src/intonationDisplay.ts)**: イントネーション表示における基本的なパディング（余白）の値を計算します。
-   **getBaseDisplayRange (src/intonationDisplay.ts)**: イントネーションチャートの基本となる表示範囲（ピッチ、時間など）を取得します。
-   **calculateDisplayRange (src/intonationDisplay.ts)**: イントネーションチャートの現在のズームレベルやスクロール位置に基づき、表示すべき正確な範囲を計算します。
-   **clampRangeExtra (src/intonationDisplay.ts)**: 表示範囲の追加量が、許容される最小値と最大値の間に収まるように制限します。
-   **applyRangeExtra (src/intonationDisplay.ts)**: 計算された追加量を表示範囲に適用し、ズームやスクロールなどの効果を反映させます。
-   **refreshDisplayRange (src/intonationDisplay.ts)**: イントネーションチャートの表示範囲を現在の状態に合わせて更新し、再描画をトリガーします。
-   **clampPitchToDisplayRange (src/intonationDisplay.ts)**: 編集中のピッチ値が、イントネーションチャートの現在の表示範囲内に収まるように制限します。
-   **calculateStepSize (src/intonationDisplay.ts)**: イントネーションポイントの編集時に適用される、ピッチや時間のステップサイズを計算します。
-   **calculateLetterKeyAdjustment (src/intonationDisplay.ts)**: キーボード操作でイントネーションを調整する際に、文字単位での微調整量を計算します。
-   **handleIntonationWheel (src/intonationDisplay.ts)**: イントネーションチャート上でのマウスホイールイベントを処理し、ズームイン・ズームアウトなどの操作に変換します。
-   **ensureWheelHandler (src/intonationDisplay.ts)**: マウスホイールイベントハンドラがイントネーションキャンバスに適切に設定されていることを確認し、必要であれば設定します。
-   **updateInitialRangeFromPoints (src/intonationDisplay.ts)**: イントネーションポイントのデータに基づき、チャートの初期表示範囲（ズームレベルなど）を更新します。
-   **initializeIntonationCanvas (src/intonationDisplay.ts)**: イントネーションを描画するキャンバス要素を初期化し、描画コンテキストを設定します。
-   **buildIntonationPointsFromQuery (src/intonationDisplay.ts)**: VOICEVOX APIから取得した音声クエリデータから、イントネーションチャートに描画するためのポイントデータを構築します。
-   **renderIntonationLabels (src/intonationDisplay.ts)**: イントネーションチャート上に、文字や音素の区切りを示すラベルを描画します。
-   **updateHoveredLabel (src/intonationDisplay.ts)**: マウスがイントネーションチャート上の特定のラベルに重なった際に、そのラベルの表示状態を更新します。
-   **drawIntonationChart (src/intonationDisplay.ts)**: イントネーションチャートの背景、グリッド、イントネーションライン、ラベルなど、すべての要素を描画します。
-   **adjustIntonationScale (src/intonationDisplay.ts)**: イントネーションチャートの縦軸（ピッチ）と横軸（時間）の表示スケールを調整します。
-   **pitchFromY (src/intonationDisplay.ts)**: イントネーションチャートのY座標を受け取り、それに対応するピッチ値に変換します。
-   **findNearestIntonationPoint (src/intonationDisplay.ts)**: 指定されたX, Y座標に最も近いイントネーションの編集ポイントを特定します。
-   **disableLoopOnIntonationEdit (src/intonationHandlers.ts)**: イントネーションが編集されている間は、音声のループ再生を自動的に無効にします。
-   **applyPitchToQuery (src/intonationHandlers.ts)**: ユーザーによって編集されたピッチ情報を、基となる音声クエリデータに適用します。
-   **applyPitchEdit (src/intonationHandlers.ts)**: イントネーションチャート上でのユーザー操作（ドラッグなど）によって発生したピッチの変更を処理し、クエリに反映します。
-   **handleIntonationPointerDown (src/intonationHandlers.ts)**: イントネーションチャート上でポインタ（マウスまたはタッチ）が押下された際のイベントを処理し、編集の開始を検出します。
-   **handleIntonationPointerMove (src/intonationHandlers.ts)**: イントネーションチャート上でポインタが移動している際のイベントを処理し、ピッチのドラッグ編集などを実行します。
-   **handleIntonationPointerUp (src/intonationHandlers.ts)**: イントネーションチャート上でポインタが離された際のイベントを処理し、編集の終了を検出します。
-   **handleIntonationMouseMove (src/intonationHandlers.ts)**: イントネーションチャート上でマウスが移動している際のイベントを処理し、ホバー状態の更新などを実行します。
-   **handleIntonationMouseLeave (src/intonationHandlers.ts)**: マウスカーソルがイントネーションチャートの領域から外れた際のイベントを処理します。
-   **handleIntonationKeyDown (src/intonationHandlers.ts)**: イントネーションチャートがフォーカスされている状態でキーボードのキーが押下された際のイベントを処理し、ピッチの微調整などを実行します。
-   **scheduleIntonationPlayback (src/intonationPlayback.ts)**: イントネーションが調整された後、その変更を反映した音声の再生をスケジュールします。
-   **replayCachedIntonationAudio (src/intonationPlayback.ts)**: 以前に合成されキャッシュされているイントネーション関連の音声を再再生します。
-   **showPlaybackStatus (src/intonationPlayback.ts)**: 音声再生の状態や進捗を示すメッセージをUIに表示します。
-   **playUpdatedIntonation (src/intonationPlayback.ts)**: 更新されたイントネーション設定に基づいて新しい音声を合成し、再生します。
-   **fetchAndRenderIntonation (src/intonationPlayback.ts)**: イントネーション情報をAPIからフェッチし、その情報を基にイントネーションチャートや関連UI要素を描画します。
-   **resetIntonationToInitial (src/intonationPlayback.ts)**: イントネーション設定を初期状態にリセットし、関連するUIも更新します。
-   **updateIntonationTiming (src/intonationState.ts)**: イントネーションのタイミング情報（音素ごとの開始・終了時間など）を更新します。
-   **isValidAudioQueryShape (src/intonationUtils.ts)**: 渡されたオブジェクトが、有効な音声クエリのデータ構造を持っているか検証します。
-   **cloneAudioQuery (src/intonationUtils.ts)**: 音声クエリオブジェクトをディープコピー（完全に独立したコピー）して返します。
-   **applySettingsToInputs (src/main.ts)**: 現在アプリケーションに設定されている各種値を、対応するUIの入力フィールドに反映させます。
-   **refreshStylesAfterPortChange (src/main.ts)**: VOICEVOXサーバーのポート番号が変更された後に、それに応じてスタイル選択などのUI要素を更新します。
-   **applyStyleSelection (src/main.ts)**: ユーザーが選択した音声スタイル（キャラクター）をアプリケーションに適用し、関連するUI要素を更新します。
-   **applyRandomStyleSelection (src/main.ts)**: 利用可能な音声スタイルの中からランダムに一つを選択し、アプリケーションに適用します。
-   **saveDelimiter (src/main.ts)**: テキストのセグメント化に使用される区切り文字の設定を保存します。
-   **scheduleSaveDelimiter (src/main.ts)**: テキスト区切り文字の設定の保存を一定時間後に実行するようにスケジュールします（デバウンスなど）。
-   **updateSpectrogramScaleLabel (src/main.ts)**: スペクトログラムの表示スケールを示すラベルを更新します。
-   **updateIntonationKeyboardToggle (src/main.ts)**: イントネーションキーボード操作の有効/無効を切り替えるトグルボタンの状態を更新します。
-   **clearAudioCache (src/playback.ts)**: 再生用に一時的に保存されているオーディオデータをキャッシュから削除します。
-   **setLoopCheckboxElement (src/playback.ts)**: ループ再生を制御するチェックボックスのDOM要素を設定または更新します。
-   **setPlayButtonAppearance (src/playback.ts)**: 再生/一時停止ボタンの見た目を、現在の再生状態に合わせて変更します。
-   **isPlayRequestPending (src/playback.ts)**: 現在、音声再生のリクエストが送信され、その完了を待っている状態であるかどうかを判定します。
-   **stopPlaybackAndResetLoop (src/playback.ts)**: 現在再生中の音声を停止し、ループ再生の設定を解除します。
-   **getAudioCacheKey (src/playback.ts)**: 現在のテキスト、スタイル、イントネーション設定などに基づき、オーディオキャッシュ用の一意のキーを生成します。
-   **setTextAndPlay (src/playback.ts)**: 入力テキストを設定し、そのテキストの音声合成と再生を開始します。
-   **downloadLastAudio (src/playback.ts)**: 最後に再生された音声データをユーザーのデバイスにダウンロードする機能を提供します。
-   **scheduleAutoPlay (src/playback.ts)**: アプリケーションのロード時やテキスト変更時など、特定の条件下で音声を自動再生するようスケジュールします。
-   **confirmResetIntonationBeforePlay (src/playback.ts)**: イントネーションが編集されている状態で再生を開始する前に、イントネーションをリセットするかどうかの確認ダイアログを表示します。
-   **handlePlayButtonClick (src/playback.ts)**: 再生ボタンがクリックされた際のイベントを処理し、再生の開始または停止を制御します。
-   **handlePlay (src/playback.ts)**: 音声再生の実際のロジックを実行するメインのハンドラ関数です。
-   **clearRealtimeWaveformCanvas (src/playback.ts)**: リアルタイムで波形を表示するキャンバスの内容をクリアします。
-   **triggerPlay (src/playback.ts)**: 音声再生処理を強制的に開始させるためのトリガー関数です。
-   **cleanup (src/playback.ts)**: 再生関連のリソース（イベントリスナー、タイマーなど）を解放し、クリーンアップします。
-   **handleReset (src/playback.ts)**: アプリケーションの状態をリセットするイベントを処理します。
-   **handleCancel (src/playback.ts)**: 現在進行中の音声合成や再生リクエストをキャンセルするイベントを処理します。
-   **loadSettings (src/settings.ts)**: ローカルストレージからアプリケーションの永続的な設定を読み込みます。
-   **saveSettings (src/settings.ts)**: 現在のアプリケーション設定をローカルストレージに保存し、永続化します。
-   **resetSettings (src/settings.ts)**: アプリケーションの設定を工場出荷時のデフォルト値にリセットします。
-   **getVoicevoxApiBase (src/settings.ts)**: VOICEVOX APIのベースURL（ポート番号を含む）を取得します。
-   **getVoicevoxNemoApiBase (src/settings.ts)**: VOICEVOX NEMO APIのベースURLを取得します。
-   **getFrequencyTopPercent (src/settings.ts)**: 音声分析で利用される周波数トップパーセンテージの設定値を取得します。
-   **getCurrentSettings (src/settings.ts)**: 現在のアプケーション設定の全体オブジェクトを取得します。
-   **setVoicevoxPort (src/settings.ts)**: VOICEVOXサーバーへの接続に使用するポート番号を設定します。
-   **setVoicevoxNemoPort (src/settings.ts)**: VOICEVOX NEMOサーバーへの接続に使用するポート番号を設定します。
-   **setFrequencyTopPercent (src/settings.ts)**: 周波数トップパーセンテージの設定値を更新します。
-   **showStatus (src/status.ts)**: アプリケーションのUI上にステータスメッセージを表示します。
-   **hideStatus (src/status.ts)**: 現在表示されているステータスメッセージをUIから非表示にします。
-   **scheduleHideStatus (src/status.ts)**: 指定された時間後にステータスメッセージを自動的に非表示にするようスケジュールします。
-   **invalidateColorVariableCache (src/status.ts)**: CSSカスタムプロパティ（CSS変数）のキャッシュを無効にし、最新の値を再取得するように促します。
-   **getColorVariable (src/status.ts)**: 指定されたCSSカスタムプロパティの値を取得します。
-   **getSelectedStyleId (src/styleManager.ts)**: 現在UIで選択されている音声スタイルの一意のIDを取得します。
-   **setSelectedStyleId (src/styleManager.ts)**: プログラム的にUIの音声スタイル選択を、指定されたスタイルIDに変更します。
-   **selectRandomStyleId (src/styleManager.ts)**: 利用可能な音声スタイルの中からランダムに一つを選択し、UIに適用します。
-   **getStyleLabel (src/styleManager.ts)**: 指定されたスタイルIDに対応する、ユーザーフレンドリーなスタイル名（ラベル）を取得します。
-   **getStyleById (src/styleManager.ts)**: 指定されたスタイルIDに対応する音声スタイルの詳細情報を取得します。
-   **getApiBaseForStyleId (src/styleManager.ts)**: 指定されたスタイルIDが使用するVOICEVOX APIのベースURL（または関連API）を取得します。
-   **getSpeakerStylesByStyleId (src/styleManager.ts)**: 指定されたスタイルID（キャラクター）に関連する複数の話者スタイル（例：喜び、悲しみ）のリストを取得します。
-   **resolveStyleMarker (src/styleManager.ts)**: テキスト内のスタイルマーカー（例: `[style_id]`）を解析し、適切なスタイル情報を解決します。
-   **parseDelimiterConfig (src/styleManager.ts)**: テキストの区切り文字設定を解析し、テキストのセグメント化に利用可能な形式に変換します。
-   **addSegment (src/styleManager.ts)**: テキストを複数の意味のあるセグメントに分割する際に、新しいセグメントを追加します。
-   **buildTextSegments (src/styleManager.ts)**: 入力テキストを、適用されるスタイルや区切り文字に基づいて、複数の論理的なセグメントに分割します。
-   **populateStyleSelect (src/styleManager.ts)**: UIのスタイル選択ドロップダウンメニューを、利用可能な音声スタイルデータで埋めます。
-   **populateSpeakerStyleSelect (src/styleManager.ts)**: UIの話者スタイル選択ドロップダウンメニューを、選択されたキャラクターに対応するスタイルデータで埋めます。
-   **fetchVoiceStyles (src/styleManager.ts)**: VOICEVOX APIから、利用可能なすべての音声スタイル（キャラクターおよびそのバリエーション）のリストを非同期で取得します。
-   **loadStoredList (src/textLists.ts)**: ローカルストレージから、お気に入りや履歴などのテキストリストを読み込みます。
-   **persistList (src/textLists.ts)**: 特定のテキストリスト（お気に入りまたは履歴）をローカルストレージに保存し、永続化します。
-   **persistLists (src/textLists.ts)**: 複数のテキストリスト（お気に入り、履歴など）をまとめてローカルストレージに保存します。
-   **dedupeAndLimit (src/textLists.ts)**: テキストリストから重複する項目を削除し、リストのサイズが指定された制限を超えないように調整します。
-   **renderList (src/textLists.ts)**: 特定のテキストリスト（お気に入りまたは履歴）の内容をWebページのUI上に描画または更新します。
-   **renderTextLists (src/textLists.ts)**: お気に入りリストと履歴リストの両方をWebページのUI上に描画または更新します。
-   **moveToFavorites (src/textLists.ts)**: 履歴リスト内のテキスト項目を、お気に入りリストに移動します。
-   **moveToHistory (src/textLists.ts)**: お気に入りリスト内のテキスト項目を、履歴リストに移動します。
-   **addToHistory (src/textLists.ts)**: 新しいテキストを履歴リストに追加します。
-   **initializeTextLists (src/textLists.ts)**: テキストリストの機能（ロード、表示、イベントリスナーなど）をアプリケーション起動時に初期化します。
-   **updateExportButtonState (src/uiControls.ts)**: 現在のアプリケーションの状態に基づいて、音声エクスポートボタンの有効/無効状態を更新します。
-   **prepareCanvas (src/visualization/canvas.ts)**: HTMLのキャンバス要素を受け取り、描画コンテキストを取得して初期設定を行うなど、描画可能な状態に準備します。
-   **getHannWindow (src/visualization/fft.ts)**: 音声信号の周波数分析に使用されるハン窓関数（Hann window）の係数を生成します。
-   **fftRadix2 (src/visualization/fft.ts)**: ラディックス2アルゴリズムに基づく高速フーリエ変換（FFT）を実行し、時間領域の信号を周波数領域に変換します。
-   **getMaxFreqByThreshold (src/visualization/fftMaxFreq.ts)**: FFTの結果から、特定の振幅のしきい値を超える周波数の中で最も高い周波数を検出します。
-   **drawRealtimeFFT (src/visualization/fftOverlay.ts)**: リアルタイムで取得した音声データに基づいて、FFT（周波数スペクトル）をキャンバス上に描画します。
-   **getTopFreqInfo (src/visualization/fftOverlay.ts)**: FFT結果から、主要な周波数ピークに関する情報（位置、値、ラベルなど）を取得します。
-   **findPeakPosition (src/visualization/fftOverlay.ts)**: FFTスペクトル内で最も顕著なピーク（特定の周波数帯の最大値）の位置を特定します。
-   **drawPeakLine (src/visualization/fftOverlay.ts)**: 検出された周波数ピークを示す垂直線またはマークをキャンバスに描画します。
-   **drawFFTLine (src/visualization/fftOverlay.ts)**: FFTの結果を線グラフとしてキャンバスに描画し、周波数スペクトルを視覚化します。
-   **drawTopBinLine (src/visualization/fftOverlay.ts)**: スペクトルの特定の上位ビンを示す線をキャンバスに描画します。
-   **drawPeakLabel (src/visualization/fftOverlay.ts)**: 検出された周波数ピークの周波数値を示すテキストラベルをキャンバスに描画します。
-   **xToFreq (src/visualization/fftUtils.ts)**: キャンバス上のX座標を、対応する周波数値に変換します。
-   **freqToBinF (src/visualization/fftUtils.ts)**: 周波数値を受け取り、それがFFTのどのビン（周波数帯域）に対応するかを計算します。
-   **getInterpolatedValue (src/visualization/fftUtils.ts)**: 離散的なデータポイントから、線形補間を用いて中間点を計算します。
-   **fftValueToY (src/visualization/fftUtils.ts)**: FFTの振幅値や強度値を、キャンバスの描画に適したY座標値に変換します。
-   **lerpColor (src/visualization/spectrogram.ts)**: 2つの色の間で線形補間を行い、中間の色を生成します。スペクトログラムの色付けに使用されます。
-   **mapIntensityToSpectrogramColor (src/visualization/spectrogram.ts)**: 音声信号の強度（振幅）を、スペクトログラムの視覚化に適した特定のカラー値にマッピングします。
-   **determineSpectrogramCeiling (src/visualization/spectrogram.ts)**: スペクトログラムの描画における最大強度（天井値）を決定し、カラーマッピングの基準とします。
-   **analyzeSpectrogramFrames (src/visualization/spectrogram.ts)**: 音声データを小さなフレームに分割し、それぞれのフレームに対して周波数分析を行い、スペクトログラムのデータを生成します。
-   **drawSpectrogram (src/visualization/spectrogram.ts)**: 生成されたスペクトログラムデータをキャンバス全体に描画します。
-   **drawSpectrogramColumn (src/visualization/spectrogram.ts)**: スペクトログラムの1つの時間フレーム（1列）をキャンバスに描画します。
-   **drawOfflineSpectrogram (src/visualization/spectrogram.ts)**: 事前分析された音声データ（オフラインデータ）に基づいてスペクトログラムを描画します。
-   **computeAudioContentHash (src/visualization/spectrogram.ts)**: 音声コンテンツのデータから一意のハッシュ値を計算し、キャッシュキーなどに利用します。
-   **buildSpectrogramSignature (src/visualization/spectrogram.ts)**: スペクトログラムの特性を示すシグネチャ（特徴量）を構築します。
-   **processChunk (src/visualization/spectrogram.ts)**: 大量のオーディオデータを小さなチャンク（塊）に分割し、逐次的に処理します。
-   **getSpectrogramScale (src/visualization/spectrogramCache.ts)**: スペクトログラムの現在設定されている表示スケールを取得します。
-   **setSpectrogramScale (src/visualization/spectrogramCache.ts)**: スペクトログラムの表示スケールを設定し、描画に影響を与えます。
-   **requestSpectrogramReset (src/visualization/spectrogramCache.ts)**: スペクトログラムの表示やキャッシュのリセットを要求します。
-   **createSpectrogramImageCache (src/visualization/spectrogramCache.ts)**: スペクトログラム画像をキャッシュするためのデータ構造またはオブジェクトを作成します。
-   **analyzeAndCacheSpectrogram (src/visualization/spectrogramCache.ts)**: 音声データを分析してスペクトログラムを生成し、その結果をキャッシュに保存します。
-   **handleSpectrogramInitialization (src/visualization/spectrogramCache.ts)**: スペクトログラム機能の初期化に関連する処理（キャッシュの準備など）を実行します。
-   **resetSpectrogramCaches (src/visualization/spectrogramCache.ts)**: すべてのスペクトログラム関連のキャッシュをクリアし、初期状態に戻します。
-   **formatTimeLabel (src/visualization/timeAxis.ts)**: 時間を表す数値を、"MM:SS"のようなユーザーフレンドリーな形式の文字列にフォーマットします。
-   **buildTimeTicks (src/visualization/timeAxis.ts)**: 時間軸に表示するティック（目盛り）の位置とラベルを計算し、生成します。
-   **drawTimeTicks (src/visualization/timeAxis.ts)**: 計算された時間ティックをキャンバスの時間軸上に描画します。
-   **computeSegmentStats (src/visualization/waveform.ts)**: 波形データの特定のセグメント（区間）に対して、平均値、最大値などの統計情報を計算します。
-   **computeSegmentCorrelation (src/visualization/waveform.ts)**: 2つの波形セグメント間の類似度や相関を計算します。
-   **extractAlignedRealtimeSegment (src/visualization/waveform.ts)**: リアルタイムで入力される波形データから、特定の時間にアラインされたセグメントを抽出します。
-   **drawRenderedWaveform (src/visualization/waveform.ts)**: 事前に生成・レンダリングされた音声データの波形をキャンバスに描画します。
-   **drawRealtimeWaveformBackground (src/visualization/waveform.ts)**: リアルタイム波形表示領域の背景（例: グリッド、固定ライン）を描画します。
-   **drawRealtimeWaveformOnly (src/visualization/waveform.ts)**: リアルタイムで入力される音声データから波形のみを抽出し、キャンバスに描画します。
-   **isPlaybackActive (src/visualization.ts)**: 現在、音声再生がアクティブに実行されているかどうかを判定します。
-   **stopActivePlayback (src/visualization.ts)**: 現在アクティブな音声再生を停止します。
-   **initializeVisualizationCanvases (src/visualization.ts)**: 波形、スペクトログラム、FFTなど、各種可視化に使用するキャンバス要素を初期化します。
-   **clearWaveformCanvas (src/visualization.ts)**: 波形表示用のキャンバスの内容をすべてクリアします。
-   **playAudio (src/visualization.ts)**: 指定された音声データを再生し、同時に可視化を開始します。
-   **setProgressPosition (src/visualization.ts)**: 再生進捗を示すバーまたはラインの現在位置を更新します。
-   **updateProgressLines (src/visualization.ts)**: 再生進捗を示すラインやマーカーを現在の再生位置に基づいて更新します。
-   **clearProgressLines (src/visualization.ts)**: 再生進捗を示すラインやマーカーをキャンバスから削除します。
-   **drawRealtimeVisuals (src/visualization.ts)**: リアルタイムで変化する音声データに基づいて、波形やFFTなどの可視化要素を描画します。
-   **handleSpectrogramDraw (src/visualization.ts)**: スペクトログラムの描画処理を管理するハンドラ関数です。
-   **cleanupPlayback (src/visualization.ts)**: 音声再生に関連する可視化リソース（イベントリスナー、タイマーなど）を解放し、クリーンアップします。
-   **requestSpectrogramDraw (src/visualization.ts)**: スペクトログラムの再描画を要求します。
-   **render (src/visualization.ts)**: 可視化フレーム全体の描画処理を実行します。
-   **finalize (src/visualization.ts)**: 可視化処理の最終段階で、後処理やリソースの解放などを行います。
-   **stopPlayback (src/visualization.ts)**: 可視化に関連する音声再生を停止し、関連するすべての描画や更新を停止します。

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
      - resetIntonationState ()
      - setStyleChangeHandler ()
      - initializeIntonationElements ()
      - isIntonationDirty ()
      - isIntonationActive ()
      - hasActiveIntonationQuery ()
      - setIntonationKeyboardEnabled ()
      - getIntonationKeyboardEnabled ()
      - renderIntonationFavoritesList ()
      - removeIntonationFavorite ()
      - applyIntonationFavorite ()
      - saveCurrentIntonationFavorite ()
      - refreshIntonationChart ()
      - setupIntonationCanvasEvents ()
      - refreshDisplayRange ()
      - ensureWheelHandler ()
      - updateInitialRangeFromPoints ()
      - buildIntonationPointsFromQuery ()
      - drawIntonationChart ()
      - playUpdatedIntonation ()
      - updateIntonationTiming ()
      - isValidAudioQueryShape ()
      - cloneAudioQuery ()
      - showStatus ()
      - scheduleHideStatus ()
  - getPitchRange (src/intonationDisplay.ts)
    - calculateBasePadding ()
      - getBaseDisplayRange ()
      - calculateDisplayRange ()
      - clampRangeExtra ()
      - applyRangeExtra ()
      - clampPitchToDisplayRange ()
      - calculateStepSize ()
      - calculateLetterKeyAdjustment ()
      - handleIntonationWheel ()
      - initializeIntonationCanvas ()
      - renderIntonationLabels ()
      - updateHoveredLabel ()
      - adjustIntonationScale ()
      - pitchFromY ()
      - findNearestIntonationPoint ()
      - getColorVariable ()
  - disableLoopOnIntonationEdit (src/intonationHandlers.ts)
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
  - fetchAndRenderIntonation ()
    - resetIntonationToInitial ()
      - getApiBaseForStyleId ()
      - updateExportButtonState ()
      - drawRenderedWaveform ()
      - initializeVisualizationCanvases ()
      - playAudio ()
  - applySettingsToInputs (src/main.ts)
    - refreshStylesAfterPortChange ()
      - applyStyleSelection ()
      - applyRandomStyleSelection ()
      - updateSpectrogramScaleLabel ()
      - updateIntonationKeyboardToggle ()
      - clearAudioCache ()
      - setLoopCheckboxElement ()
      - setPlayButtonAppearance ()
      - isPlayRequestPending ()
      - scheduleAutoPlay ()
      - handlePlay ()
      - loadSettings ()
      - resetSettings ()
      - getCurrentSettings ()
      - setVoicevoxPort ()
      - setVoicevoxNemoPort ()
      - setFrequencyTopPercent ()
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
      - confirmResetIntonationBeforePlay ()
      - handlePlayButtonClick ()
      - clearRealtimeWaveformCanvas ()
      - cleanup ()
      - handleCancel ()
      - parseDelimiterConfig ()
      - buildTextSegments ()
      - addToHistory ()
      - stopActivePlayback ()
  - saveSettings ()
    - getVoicevoxApiBase ()
      - getVoicevoxNemoApiBase ()
      - getFrequencyTopPercent ()
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
  - catch (src/audio.ts)
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
- for (src/audio.ts)
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)
- while (src/styleManager.ts)

---
Generated at: 2026-03-03 07:05:53 JST
