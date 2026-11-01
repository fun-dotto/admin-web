---
root: false
targets: ["*"]
description: "UI コンポーネント実装のルール (shadcn/ui, Tailwind CSS, Storybook)"
globs: ["src/**/*.tsx", "src/**/*.stories.tsx", "src/styles.css"]
---

# UI 実装ルール

## 技術スタック

- UI コンポーネントは shadcn/ui (`components.json`, style: `new-york`) を基盤とする。
- スタイリングは Tailwind CSS (v4) のユーティリティクラスのみで行う。
  - CSS ファイル・CSS Modules・`style` 属性・CSS-in-JS は使わない（動的な値で Tailwind では表現できない場合のみ `style` を許容）。
- アイコンは `lucide-react` を使う。
- クラスの結合・条件分岐は `cn()` (`#/lib/utils`) を使い、文字列連結はしない。
- バリアントは `class-variance-authority` (`cva`) で定義し、props の分岐でクラスを組み立てない。

## shadcn/ui の扱い

- 必要なコンポーネントは独自実装する前に shadcn/ui に存在するか確認し、`pnpm dlx shadcn@latest add <name>` で追加する。
- `src/components/ui/` は shadcn/ui の生成物置き場とし、プロジェクト固有のロジックや見た目の変更は原則加えない。
  - カスタマイズが必要な場合は `src/components/` 配下でラップしたコンポーネントを作る。
  - やむを得ず `ui/` を直接編集する場合は、変更理由をコメントで残す。

## カラー・デザイントークン

- 色は `src/styles.css` に定義されたカラーパレット（CSS 変数 / テーマトークン）のみを使う。
  - 例: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, `text-destructive`
- 次は禁止:
  - Tailwind 標準パレットの直接指定（`bg-zinc-500`, `text-red-600` など）
  - 任意値による色指定（`bg-[#ff0000]`, `text-[rgb(...)]` など）
  - `white` / `black` の直接指定（`background` / `foreground` 系トークンを使う）
- 新しい色が必要な場合は、まず `src/styles.css` にトークンとしてライト・ダーク両方の値を追加してから使う。
- 余白・角丸・フォントサイズ・影なども Tailwind のスケールやテーマトークンを使い、任意値（`p-[13px]` など）は避ける。
- ダークモードはトークン経由で対応し、コンポーネント内で `dark:` による個別の色指定はしない。

## コンポーネント設計

### ステートレス（Presentational）を基本とする

- UI コンポーネントは可能な限りステートレスにし、表示に必要なデータとイベントハンドラはすべて props で受け取る。
- データ取得・ミューテーション・ルーティング・グローバル状態へのアクセスは UI コンポーネント内で行わない。
  - これらはルート（`src/routes/`）やコンテナ層で行い、結果を props として渡す。
- UI 内に閉じた一時的な状態（開閉、ホバー、入力中の値など）は許容するが、外部から制御したい可能性があるものは controlled / uncontrolled の両方に対応する（`value` + `onValueChange` と `defaultValue`）。
- ローディング・エラー・空状態も props で表現し、どの状態でも単体で描画できるようにする。
- 副作用 (`useEffect`) は最小限にし、派生値は render 中に計算する。

### 小さく分割する

- 1 コンポーネント 1 責務とし、1 ファイル 1 コンポーネント（export）を基本とする。
- 目安として JSX が 100 行を超える、または繰り返し・条件分岐で読みにくくなったら分割する。
- 繰り返し描画される要素（リストのアイテム、テーブルの行など）は個別コンポーネントに切り出す。
- 分割は見た目の単位ではなく、意味（ドメイン）の単位で行う。

### Props

- props の型は `type <ComponentName>Props = { ... }` として明示的に定義し export する。
- ネイティブ要素をラップする場合は `React.ComponentProps<"button">` などを継承し、`className` と残りの props を透過する。
- イベントハンドラは `on<Event>` の命名にする（例: `onSubmit`, `onSelectChange`）。
- boolean props は `is` / `has` 等を付けず、HTML 属性に倣う（`disabled`, `loading`, `selected`）。

## アクセシビリティ

- セマンティックな HTML 要素を使う（クリック可能な要素は `button` / `a`、`div` に `onClick` を付けない）。
- フォーム要素には必ず `label` を関連付ける。
- アイコンのみのボタンには `aria-label` を付ける。
- キーボード操作とフォーカス表示 (`focus-visible:`) を損なわない。shadcn/ui (Radix) の a11y 挙動を上書きしない。
- Storybook の a11y アドオンで違反が出ない状態を保つ。

### クリック可能な行・カード（stretched link）

テーブルの行やカード全体をクリックで遷移させたい場合は、`tr` / `div` に `onClick` を付けず、stretched link で実装する。

- 理由: `onClick` だけではキーボード操作・スクリーンリーダーで遷移できず、新しいタブで開く・URL コピーなどリンク本来の機能も失われるため。
- 実装方針:
  - 行（カード）のコンテナに `relative` を付ける。
  - 遷移先を表すリンク（`<Link>` / `<a>`）は 1 つだけ置き、主となる列（ID・名前など）に配置する。リンクのテキストがそのまま遷移先の説明になるようにする。
  - リンクに `after:absolute after:inset-0` を付けて、クリック領域を行全体に広げる。フォーカス表示も `focus-visible:after:` で行全体に出す。
  - 行内のボタンなど他の操作要素には `relative z-10` を付けてリンクより前面に出し、`stopPropagation` に頼らない。
  - 遷移は `navigate()` ではなくリンク要素で行う。

## フォーム: 別リソースの参照

作成・編集フォームで別リソースの ID（`subject_id`, `room_id` など）を入力させる場合は、ID を直接入力させず、名前などで検索して選択できるようにする。

- 理由: ID は人が覚えて入力できる値ではなく、入力ミスで存在しない ID や別のオブジェクトを参照してしまうため。
- UI 仕様:
  - shadcn/ui の Popover + Command による検索可能なコンボボックス（`ResourceReferenceField`）を使う。
  - 選択肢には人が識別できる表示名（`name`, `title` など）を主に、ID を補足として表示する。検索は表示名と ID の両方にマッチさせる。
  - 選択済みの値は表示名で表示し、選択を解除するボタンを用意する。選択肢の読み込み前でも、既存の ID はそのまま表示する。
  - 読み込み中・取得エラー・該当なしの状態を表示する。
  - フォームへは参照先の ID を送る（hidden input で `FormData` から取得できるようにする）。
- 実装方針:
  - 参照フィールドと参照先リソースの対応は `src/lib/admin/resources.ts` の `referenceTargets` に明示的に定義する。proto に参照情報が無いため、命名規約からの推測で済ませない。新しい参照フィールドが増えたらここに追加する。
  - リソース自身の主キー（例: `routes` の `route_id`）は参照として扱わない。
  - 表示名に使うフィールドは `getDisplayField` の候補順で決める。
  - 選択肢の取得はコンテナ層（`useReferenceOptions`）で行い、UI コンポーネントには `options` / `loading` / `error` を props で渡す。
  - List API に検索条件が無いため、参照先は上限付きで全件取得してクライアント側で絞り込む。API に検索が追加されたらサーバー側検索に切り替える。

## Storybook

- `src/components/` 配下のコンポーネント（`ui/` を含む）には、同じディレクトリに `<ComponentName>.stories.tsx` を作成する。
- Story は網羅的に作成する。最低限、以下を該当する範囲で用意する:
  - デフォルト状態
  - すべてのバリアント・サイズ（`cva` の各 variant）
  - 状態: `disabled`, `loading`, エラー, 空, 選択中など
  - データ量の境界: 0 件, 1 件, 多数件, 長い文字列（折り返し・省略の確認）
  - インタラクションがあるものは `play` 関数で操作と結果を検証する
- イベントハンドラは `fn()` (`storybook/test`) で渡し、Actions で確認できるようにする。
- Story はステートレスなコンポーネントに props を渡すだけで成立させ、API モックやグローバル状態に依存しない。
- 形式は CSF3（`satisfies Meta<typeof Component>`、`StoryObj<typeof meta>`）で書く。
- コンポーネントを追加・変更したら、対応する Story も同じ変更で追加・更新する。

## レスポンシブ

- モバイルファーストで記述し、`sm:` `md:` `lg:` で拡張する。
- 固定幅・固定高さは避け、flex / grid とトークンのスペーシングでレイアウトする。
