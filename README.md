# worklog_recorder

Deno on SlackAppを利用して、Slack上で作業ログを記録するためのアプリケーションです。

## Demo


https://github.com/user-attachments/assets/7176fd5c-104c-4483-aa8e-40cdaedbc604




## How to use

### Preparation

```bash
brew install deno
brew install slack-cli
```

### Local

```bash
git clone https://github.com/tubone24/worklog_recorder
cd worklog_recorder
slack run
```

### Deploy

```bash
slack deploy

# Create Workflow dispatch triggers
slack trigger create --trigger-def "./triggers/user_monthly_hours.ts"
slack trigger create --trigger-def "./triggers/record_work_hours.ts"
slack trigger create --trigger-def "./triggers/delete_work_hours_trigger.ts"
slack trigger create --trigger-def "./triggers/monthly_hours_overview.ts"
```
