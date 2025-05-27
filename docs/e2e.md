# playwrightでのE2Eテスト

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [playwrightでのE2Eテスト](#playwrightでのe2eテスト)
  - [E2Eテストの概略](#e2eテストの概略)
  - [環境の設定](#環境の設定)
    - [新規でSveltekitプロジェクトを作成する場合](#新規でsveltekitプロジェクトを作成する場合)
    - [既存のプロジェクトにplaywrightを導入したい場合](#既存のプロジェクトにplaywrightを導入したい場合)
  - [設定ファイル(playwright.config.ts)](#設定ファイルplaywrightconfigts)
  - [Playwrightが提供するテストツール](#playwrightが提供するテストツール)
    - [ロケーター、アクション](#ロケーター-アクション)
    - [アサーション](#アサーション)
    - [フック](#フック)
  - [その他](#その他)
    - [パラメータ化テスト](#パラメータ化テスト)
  - [VSCodeの拡張機能](#vscodeの拡張機能)
    - [個別のテストに対するテスト実行](#個別のテストに対するテスト実行)
    - [Show browser](#show-browser)
    - [Show trace viewer](#show-trace-viewer)
    - [Record new](#record-new)
  - [CI環境でのplaywrightの実行](#ci環境でのplaywrightの実行)
    - [参考資料](#参考資料)

<!-- /code_chunk_output -->

## E2Eテストの概略
E2Eテストはシステム全体に対して行われるテスト。

そのシステムの利用者の目線に立って、ブラウザ上で入力してから実行結果が返ってくるまでの一連の流れを検証する。

実際にブラウザを起動してテストを実行するので、単体テストや結合テストに比べて実行時間がかかる。

## 環境の設定

### 新規でSveltekitプロジェクトを作成する場合

[Svelte CLI](https://hackmd.io/_uploads/BJQ7f3-Mel.png)を使用して

```bash 
npx sv create (プロジェクト名)
```

を実行。

以下の画面でplaywrightを選択することで、
playwrightがインストールされ、設定ファイル、テストフォルダが生成される。


![alt text](image.png)


![alt text](image-1.png)

テストフォルダの中にテストファイルを作成する。デフォルトでは以下の形式のファイルがテストファイルとして認識される。
```.*(test|spec).(js|ts|mjs)```


### 既存のプロジェクトにplaywrightを導入したい場合

Svelte CLIで

```bash
npx sv add playwright
```
とすると、同様にplaywrightがインストールされる。

参考: https://svelte.jp/docs/cli/sv-add

## 設定ファイル(playwright.config.ts)

各設定内容は[ドキュメント](https://playwright.dev/docs/test-configuration)を参照

- testDir
  - e2eテストに使用するテストフォルダを指定(例: tests, e2e)
- webServer
  - テスト前に実装するwebサーバーの設定
  - `reuseExistingServer: !process.env.CI`としてローカルでは既に立ち上げたサーバーが存在する場合はそのサーバーを使用するようにする。(メモ: sveltekitのプロジェクトファイル直下に`.env`ファイルが無い場合に、playwrightが環境変数を読み込むことができずに失敗してしまうことがあるが、`reuseExistingServer = true`として、既存のサーバを使用した場合には環境変数
  を読み込むことができた)

- .envファイルの設定
   - playwrightが読み込む`.env`ファイルの位置を指定する。https://playwright.dev/docs/test-parameterize#env-files


- project
  - 同一の設定で実行されるテストを論理的にまとめたグループ

  - 以下のように記述すると、`chromium`, `firefox`, `webkit`の3種類のブラウザでそれぞれのテストが実行される。

```
projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
```
  
  





## Playwrightが提供するテストツール
参考: [Playwrightが提供するAPI一覧](https://playwright.dev/docs/api/class-test)


### ロケーター、アクション

- ロケーター
ページ内の要素を特定する。
操作対象のテキストボックスやボタンなどを探し出す。

　　[ロケーター一覧](https://playwright.dev/docs/locators)

- アクション
ロケーターを使用して選択した要素に対して、「ボタンをクリックする」、「セレクトボックスを選択する」といったユーザーの操作をシュミレーションする。


- ロケーターの例

| メソッド名                     | 説明                                              | 使用例                                                    |
|--------------------------------|---------------------------------------------------|-----------------------------------------------------------|
| `page.getByRole()`             | アクセシビリティ属性によって要素を検索            | `await page.getByRole('button', { name: '送信' }).click();` |
| `page.getByLabel()`            | 関連するラベルのテキストでフォームコントロールを検索 | `await page.getByLabel('ユーザー名').fill('yusuke123');`    |
| `page.getByPlaceholder()`      | プレースホルダーをもとに入力欄を検索              | `await page.getByPlaceholder('パスワード').fill('secret');` |
| `page.getByText()`             | テキストコンテンツで要素を検索                    | `await page.getByText('ログイン').click();`                |
| page.locator() |   | page.locator('#submit-button') (idを指定)  






### アサーション

テスト内で期待される状態と実際の状態を比較/検証する。

- アサーションの例

| アサーション                              | 説明                  |
| ---------------------------------- | ------------------- |
| `toBeVisible()`                    | 要素が表示されているか         |
| `toBeHidden()`                     | 非表示か                |
| `toHaveText(text)`                 | テキスト内容が一致するか        |
| `toHaveValue(value)`               | input の値が一致するか      |
| `toHaveAttribute(name, value)`     | 属性の値が一致するか          |
| `toHaveClass(className)`           | class 名が一致するか       |
| `toBeEnabled()` / `toBeDisabled()` | 有効／無効か              |
| `toBeChecked()`                    | チェックボックスがチェックされているか |

- 例1: (`/user/home`に遷移していることを確認)

```
    await page.goto('/login');
    await page.locator('#userEmailTextbox').fill('hoge@example.com');
    await page.locator('#userPasswordTextbox').fill('00001111aa');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('/user/home');
```

- 例2: (エラーメッセージが表示されていることを確認)

```
  await page.locator('#item-title').fill('');
  await page.locator('#submit-update').click();
  await expect(
    page.locator('div.error-msg', { hasText: 'タイトルは入力必須です。' })
      ).toBeVisible();
    });
```








### フック 

複数のテスト間で準備、片付けコードを共有する。
`beforeAll`, `beforeEach`, `afterEach`, `afterAll`


| フック名       | 実行タイミング                           | 実行回数                | 主な用途例                                     |
|----------------|------------------------------------------|--------------------------|------------------------------------------------|
| `beforeAll`    | 各テストスイート（ファイルやdescribe）開始前 | スイートごとに1回         | データベース接続の初期化、共通データの作成など  |
| `beforeEach`   | 各 `test()` の直前                        | 各テストごとに1回         | ページ初期化、DBの初期状態リセットなど         |
| `afterEach`    | 各 `test()` の直後                        | 各テストごとに1回         | データのクリーンアップ、ログ保存など           |
| `afterAll`     | 各テストスイートのすべてのテスト終了後      | スイートごとに1回         | DB切断、リソース解放、スクリーンショットまとめなど |

- 実行順

 ```mermaid
sequenceDiagram
    autonumber
    participant Suite as テストスイート

    Note over Suite: テストスイート開始
    Suite->>Suite: beforeAll()

    loop 各テスト (テスト1, テスト2, …)
      Suite->>Suite: beforeEach()
      Suite->>Suite: test('テストX')
      Suite->>Suite: afterEach()
    end

    Suite->>Suite: afterAll()
    Note over Suite: テストスイート終了
```


- 使用例1(ログイン処理)


ログイン処理は各テストの前に毎回実行されるので、`beforeEach`を使用する(補足:ログイン処理を毎回実行すると実行時間がかかる。global-setup.ts内でcontext.storageState()を使用して　「一度だけログイン」-> 「テスト間でセッション情報を共有」とすることで実行時間を短縮できそう。後日追記する)



```ts
test.describe('フォーム作成: メールアドレスのテスト', () => {
  /**
   * このファイル内の各テストに共通する前処理をbeforeEachに記述する
   * テストの前に毎回実行される
   * ログイン->「新しいフォームを作成する」ボタンを押してメールアドレス入力画面(/user/new_form)に遷移
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('#userEmailTextbox').fill('hoge@example.com');
    await page.locator('#userPasswordTextbox').fill('00001111aa');
    await page.locator('button[type="submit"]').click();
    await page.locator('#create-new-form').click();
  });
 ```

- 使用例2(DBを使用したテスト)

テスト間での独立性を保つために、毎回DBをクリアする

```ts
test.describe('DBを使用したテスト', () => {
  // テストスイート開始前に一度だけ実行
  beforeAll(async () => {
    console.log('beforeAll: 全テーブルをクリアしてテストユーザーを作成');
    await cleanUpDatabase();
    await createTestUser();
  });

  // 各テスト前に、テストユーザーは残したまま他テーブルだけクリア
  beforeEach(async () => {
    console.log('beforeEach: 子テーブルをクリア');
    await cleanUpChildTables();
  });

  // 各テスト後に、同様に子テーブルをクリア
  afterEach(async () => {
    console.log('afterEach: 子テーブルをクリア');
    await cleanUpChildTables();
  });

  // 全テスト終了後に全データをクリアしてDB接続を切断
  afterAll(async () => {
    console.log('afterAll: 全テーブルをクリアして切断');
    await cleanUpDatabase();
    await disconnectDatabase();
  });
  
  test('テスト1', async ({ page }) => {
    ....
  }),
  
  test('テスト2', async ({ page }) => {
    ....
  }),
  ............
 });
```

## その他

### パラメータ化テスト

https://playwright.dev/docs/test-parameterize

複数の引数に対するテスト
playwrightでも実行できるが、時間が掛かるので単体テスト向き

- 例

```ts
    const heights = [100, 150, 200, 250, 300, 350, 400, 450, 500];
    for (const height of heights) {
      test(`高さを ${height}px にした場合`, async ({ page }) => {
        await page.locator('#comment-body').click();
        await page.locator('#comment-body').fill('');
        await page.locator('#comment-body').fill('テストコメント');

        await page.getByRole('combobox').selectOption(String(height));

        await page.getByRole('button', { name: '更新する' }).click();

        const commentBody = page.locator('.itemComment > div');
        const style = await commentBody.getAttribute('style');

        // 高さに関するスタイルが含まれているかチェック
        expect(style).toContain(`height: ${height}px;`);
      });
    }
```

## VSCodeの拡張機能

公式が提供している。
https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

### 個別のテストに対するテスト実行

![alt text](image-2.png)

### Show browser
テスト実行時にブラウザを表示する。
![alt text](image-3.png)
![alt text](image-4.png)

### Show trace viewer
![alt text](image-5.png)

![alt text](image-6.png)


### Record new

「Record new」をクリックすると、ブラウザが立ち上げられる。ブラウザ上でボタンの操作等のアクションをすると、テストファイルに反映される。


![alt text](image-8.png)

- ブラウザ上で「+」ボタンをクリック
![alt text](image-7.png)

- 記録された操作
```
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Increase the counter by one' }).click();
});
```



## CI環境でのplaywrightの実行

`.github/workflows`フォルダ内のymlファイルに記述する。


Playwrightのドキュメントで手順が紹介されている　https://playwright.dev/docs/ci-intro

APIキーなどが必要な場合は事前にSecretに登録しておく必要がある。
[GitHub Actions でのシークレットの使用](https://docs.github.com/ja/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)

パブリックリポジトリの場合は料金がかからないが、プライベートリポジトリの場合は一定のストレージ、時間を超えると料金がかかる

[GitHub Actions の課金について](https://docs.github.com/ja/billing/managing-billing-for-your-products/managing-billing-for-github-actions/


about-billing-for-github-actions#github-actions-%E3%81%AE%E8%AA%B2%E9%87%91%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)


### 参考資料

- [playwrightのドキュメント](https://playwright.dev/)

- [Playwrightのベストプラクティスを翻訳してみた](https://daipresents.com/2024/04/15/playwright-best-practices/#test-user-visible-behavior)

