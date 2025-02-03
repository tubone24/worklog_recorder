import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { DeleteWorkHoursFunctionDefinition } from "../functions/delete_work_hours_function.ts";
import { FetchDailyRecordsFunctionDefinition } from "../functions/fetch_daily_records_function.ts";

const DeleteWorkHoursWorkflow = DefineWorkflow({
    callback_id: "delete_work_hours_workflow",
    title: "工数記録の削除",
    description: "指定された工数記録を削除する",
    input_parameters: {
        properties: {
            interactivity: { type: Schema.slack.types.interactivity },
            user_id: { type: Schema.types.string },
        },
        required: ["interactivity", "user_id"],
    },
});

// Step 1: 日付選択フォーム
const dateSelectStep = DeleteWorkHoursWorkflow.addStep(
    Schema.slack.functions.OpenForm,
    {
        title: "削除する工数記録の日付選択",
        interactivity: DeleteWorkHoursWorkflow.inputs.interactivity,
        submit_label: "次へ",
        fields: {
            elements: [{
                name: "target_date",
                title: "日付",
                type: Schema.types.string,
                description: "削除したい工数記録の日付を選択してください（YYYY-MM-DD）",
            }],
            required: ["target_date"],
        },
    }
);

const fetchRecordsStep = DeleteWorkHoursWorkflow.addStep(
    FetchDailyRecordsFunctionDefinition,
    {
        date: dateSelectStep.outputs.fields.target_date,
        user_id: DeleteWorkHoursWorkflow.inputs.user_id,
        interactivity: dateSelectStep.outputs.interactivity,
    }
);

// Step 3: 取得した記録を表示
const displayRecordsStep = DeleteWorkHoursWorkflow.addStep(
    Schema.slack.functions.OpenForm,
    {
        title: "削除する工数記録を選んでください",
        description: "削除したい工数記録のIDを控えてください",
        interactivity: fetchRecordsStep.outputs.interactivity,
        submit_label: "次へ",
        fields: {
            elements: [{
                name: "record_id",
                title: "削除する記録ID",
                type: Schema.types.string,
                default: fetchRecordsStep.outputs.records,
                description: "上のメッセージに表示された記録の中から、削除したい記録のIDを控えてください。次のフォームで入力します",
                long: true,
            }],
            required: ["record_id"],
        },
    }
);

// Step 4: ID入力フォーム
const recordSelectStep = DeleteWorkHoursWorkflow.addStep(
    Schema.slack.functions.OpenForm,
    {
        title: "削除する工数記録の選択",
        interactivity: displayRecordsStep.outputs.interactivity,
        submit_label: "削除",
        fields: {
            elements: [{
                name: "record_id",
                title: "削除する記録ID",
                type: Schema.types.string,
                description: "上のメッセージに表示された記録の中から、削除したい記録のIDを入力してください",
            }],
            required: ["record_id"],
        },
    }
);

// Step 5: 削除の実行
const deleteStep = DeleteWorkHoursWorkflow.addStep(
    DeleteWorkHoursFunctionDefinition,
    {
        record_id: recordSelectStep.outputs.fields.record_id,
        user_id: DeleteWorkHoursWorkflow.inputs.user_id,
    }
);

// Step 5: 結果の通知
DeleteWorkHoursWorkflow.addStep(
    Schema.slack.functions.SendDm,
    {
        user_id: DeleteWorkHoursWorkflow.inputs.user_id,
        message: deleteStep.outputs.message,
    }
);

export default DeleteWorkHoursWorkflow;
