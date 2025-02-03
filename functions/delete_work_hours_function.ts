// functions/delete_work_hours_function.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { WorkHoursRecord } from "../datastore.ts";

export const DeleteWorkHoursFunctionDefinition = DefineFunction({
    callback_id: "delete_work_hours_function",
    title: "工数記録の削除",
    description: "指定された工数記録を削除する",
    source_file: "functions/delete_work_hours_function.ts",
    input_parameters: {
        properties: {
            record_id: { type: Schema.types.string },
            user_id: { type: Schema.types.string },
        },
        required: ["record_id", "user_id"],
    },
    output_parameters: {
        properties: {
            message: { type: Schema.types.string },
        },
        required: ["message"],
    },
});

const DeleteWorkHoursFunction = SlackFunction(
    DeleteWorkHoursFunctionDefinition,
    async ({ inputs, client }) => {
        const { record_id, user_id } = inputs;

        // 記録の存在確認と権限チェック
        const getResult = await client.apps.datastore.get({
            datastore: WorkHoursRecord.name,
            id: record_id,
        });

        if (!getResult.ok) {
            return { outputs: { message: "指定された記録が見つかりませんでした。" } };
        }

        // 権限チェック（記録の作成者のみ削除可能）
        if (!getResult.item.user_ids.includes(user_id)) {
            return { outputs: { message: "この記録を削除する権限がありません。" } };
        }

        // 記録の削除
        const deleteResult = await client.apps.datastore.delete({
            datastore: WorkHoursRecord.name,
            id: record_id,
        });

        if (!deleteResult.ok) {
            return { outputs: { message: "記録の削除に失敗しました。" } };
        }

        return { outputs: { message: "工数記録を削除しました。" } };
    }
);

export default DeleteWorkHoursFunction;
