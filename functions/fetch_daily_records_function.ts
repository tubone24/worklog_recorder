import { SlackFunction, DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { WorkHoursRecord } from "../datastore.ts";
import { WorkHoursRecordType } from "../types/work_hours_record_type.ts";

export const FetchDailyRecordsFunctionDefinition = DefineFunction({
    callback_id: "fetch_daily_records",
    title: "日次工数記録の取得",
    description: "指定された日付のユーザーの工数記録を取得します",
    source_file: "functions/fetch_daily_records_function.ts",
    input_parameters: {
        properties: {
            date: {
                type: Schema.types.string,
                description: "取得対象の日付（YYYY-MM-DD形式）",
            },
            user_id: {
                type: Schema.types.string,
                description: "取得対象のユーザーID",
            },
            interactivity: { type: Schema.slack.types.interactivity },
        },
        required: ["date", "user_id", "interactivity"],
    },
    output_parameters: {
        properties: {
            records: {
                type: Schema.types.string,
            },
            interactivity: { type: Schema.slack.types.interactivity },
        },
        required: ["records", "interactivity"],
    },
});

export default SlackFunction(
    FetchDailyRecordsFunctionDefinition,
    async ({ inputs, client }) => {
        const { date, user_id, interactivity } = inputs;

        try {
            const result = await client.apps.datastore.query({
                datastore: WorkHoursRecord.name,
                expression: "#work_date = :date AND contains(#user_ids, :user_id)",
                expression_attributes: {
                    "#work_date": "work_date",
                    "#user_ids": "user_ids",
                },
                expression_values: {
                    ":date": date,
                    ":user_id": user_id,
                },
            });

            const records = result.items.map(item => (
                `${item.id} - ${item.hours}時間 ${item.reason}`));

            return { outputs: { records: records.join("\n"), interactivity } };
        } catch (error) {
            console.error("データ取得エラー:", error);
            return { outputs: { records: [], interactivity } };
        }
    },
);