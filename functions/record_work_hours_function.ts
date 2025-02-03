import { SlackFunction, DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { WorkHoursRecord } from "../datastore.ts";

export const RecordWorkHoursFunctionDefinition = DefineFunction(
    {
        callback_id: "record_work_hours_function",
        title: "工数記録",
        description: "入力内容を DataStore に記録する",
        source_file: "functions/record_work_hours_function.ts",
        input_parameters: {
            properties: {
                interactivity: { type: Schema.slack.types.interactivity },
                user_ids: {
                    type: Schema.types.array,
                    items: { type: Schema.types.string }
                },
                hours: {
                    type: Schema.types.number
                },
                reason: { type: Schema.types.string  },
                work_date: { type: Schema.types.string },
            },
            required: ["user_ids", "hours", "reason", "work_date"],
        },
    }
);

const RecordWorkHoursFunction = SlackFunction(
    RecordWorkHoursFunctionDefinition,
    async ({ inputs, client }) => {
        console.log(inputs);
        const record = {
            id: crypto.randomUUID(),
            user_ids: inputs.user_ids,
            hours: inputs.hours,
            reason: inputs.reason,
            work_date: inputs.work_date,
        };

        console.log("record", record);

        const result = await client.apps.datastore.put({
            datastore: WorkHoursRecord.name,
            item: record,
        });
        if (!result.ok) {
            throw new Error("工数記録の保存に失敗しました");
        }
        return { outputs: {} };
    }
);

export default RecordWorkHoursFunction;
