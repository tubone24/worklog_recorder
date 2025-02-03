import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const WorkHoursRecord = DefineDatastore({
    name: "work_hours_record",
    primary_key: "id",
    attributes: {
        id: { type: Schema.types.string },
        // 複数ユーザー（Slack のユーザーIDの文字列配列）
        user_ids: {
            type: Schema.types.array,
            items: { type: Schema.types.string },
        },
        // 稼働時間（数値）
        hours: { type: Schema.types.number },
        // 稼働理由（テキスト）
        reason: { type: Schema.types.string },
        // 稼働日（ISO 日付文字列 "YYYY-MM-DD" など）
        work_date: { type: Schema.types.string },
    },
});