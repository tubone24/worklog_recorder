import { SlackFunction, DefineFunction } from "deno-slack-sdk/mod.ts";
import { WorkHoursRecord } from "../datastore.ts";

export const CalculateMonthlyHoursFunctionDefinition = DefineFunction({
    callback_id: "calculate_monthly_hours_function",
    title: "月の稼働時間集計",
    source_file: "functions/calculate_monthly_hours_function.ts",
    description: "指定月の各ユーザーの稼働時間を計算する",
    input_parameters: {
        properties: {
            month: { type: "string" },
        },
        required: ["month"],
    },
    output_parameters: {
        properties: {
            user_hours: { type: "object" },
        },
        required: ["user_hours"],
    },
});

const CalculateMonthlyHoursFunction = SlackFunction(
    CalculateMonthlyHoursFunctionDefinition,
    async ({ inputs, client }) => {
        const { month } = inputs;

        const listResult = await client.apps.datastore.query({
            datastore: WorkHoursRecord.name,
            expression: "begins_with(#work_date, :month)",
            expression_attributes: { "#work_date": "work_date" },
            expression_values: { ":month": month }
        });

        if (!listResult.ok) {
            throw new Error("工数記録の取得に失敗しました");
        }

        const records = listResult.items;
        const userHours: Record<string, Record<string, { hours: number; reason: string }>> = {};

        for (const record of records) {
            for (const userId of record.user_ids) {
                if (!userHours[userId]) {
                    userHours[userId] = {};
                }

                userHours[userId][record.work_date] = {
                    hours: record.hours,
                    reason: record.reason
                };
            }
        }

        return { outputs: { user_hours: userHours } };
    }
);

export default CalculateMonthlyHoursFunction;
