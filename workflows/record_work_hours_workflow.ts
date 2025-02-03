import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ViewsOpenFunctionDefinition } from "../functions/views_open_function.ts";
import { RecordWorkHoursFunctionDefinition } from "../functions/record_work_hours_function.ts";

const RecordWorkHoursWorkflow = DefineWorkflow({
    callback_id: "record_work_hours_workflow",
    title: "工数記録",
    description: "工数（稼働時間）を記録します",
    input_parameters: {
        properties: {
            interactivity: { type: Schema.slack.types.interactivity },
        },
        required: ["interactivity"],
    },
});

const formStep = RecordWorkHoursWorkflow.addStep(
    Schema.slack.functions.OpenForm,
    {
        title: "工数記録",
        interactivity: RecordWorkHoursWorkflow.inputs.interactivity,
        submit_label: "送信",
        fields: {
            elements: [
                {
                    name: "user_ids",
                    title: "ユーザー",
                    type: Schema.types.array,
                    items: { type: Schema.slack.types.user_id }
                },
                {
                    name: "hours",
                    title: "稼働時間（時間）",
                    type: Schema.types.number
                },
                {
                    name: "reason",
                    title: "稼働理由",
                    type: Schema.types.string
                },
                {
                    name: "work_date",
                    title: "稼働日",
                    type: Schema.slack.types.date,
                    default: new Date().toISOString().split("T")[0]
                }
            ],
            required: ["user_ids", "hours", "reason", "work_date"]
        }
    }
);

RecordWorkHoursWorkflow.addStep(RecordWorkHoursFunctionDefinition, {
    interactivity: formStep.outputs.interactivity,
    user_ids: formStep.outputs.fields.user_ids,
    hours: formStep.outputs.fields.hours,
    reason: formStep.outputs.fields.reason,
    work_date: formStep.outputs.fields.work_date
});
export default RecordWorkHoursWorkflow;
