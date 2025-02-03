import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CalculateMonthlyHoursFunctionDefinition } from "../functions/calculate_monthly_hours_function.ts";
import { FormatMonthlySummaryFunctionDefinition } from "../functions/format_monthly_summary_function.ts";
import { ExtractUserSummaryFunctionDefinition } from "../functions/extract_user_summary_function.ts";

const UserMonthlyHoursWorkflow = DefineWorkflow({
    callback_id: "user_monthly_hours_workflow",
    title: "月の稼働工数確認（個人）",
    description: "実行ユーザー自身の月間稼働記録を表示する",
    input_parameters: {
        properties: {
            interactivity: { type: Schema.slack.types.interactivity },
            user_id: { type: Schema.types.string },
            channel_id: { type: Schema.slack.types.channel_id },
        },
        required: ["interactivity", "user_id", "channel_id"],
    },
});

// OpenFormステップを追加
const formStep = UserMonthlyHoursWorkflow.addStep(
    Schema.slack.functions.OpenForm,
    {
        title: "個人の稼働時間集計期間の選択",
        interactivity: UserMonthlyHoursWorkflow.inputs.interactivity,
        submit_label: "集計開始",
        fields: {
            elements: [{
                name: "target_month",
                title: "対象年月",
                type: Schema.types.string,
                default: new Date().toISOString().slice(0, 7),
                description: "集計する年月を選択してください（YYYY-MM形式）",
            }],
            required: ["target_month"],
        },
    }
);

// ① 全ユーザーの集計結果を取得
const calcStep = UserMonthlyHoursWorkflow.addStep(
    CalculateMonthlyHoursFunctionDefinition,
    {
        month: formStep.outputs.fields.target_month,
    }
);

// ② テキスト整形
const formatStep = UserMonthlyHoursWorkflow.addStep(
    FormatMonthlySummaryFunctionDefinition,
    {
        user_hours: calcStep.outputs.user_hours,
        month: formStep.outputs.fields.target_month,
    }
);

// ③ 実行ユーザーの行のみを抽出
const extractStep = UserMonthlyHoursWorkflow.addStep(
    ExtractUserSummaryFunctionDefinition,
    {
        summary: formatStep.outputs.summary,
        user_id: UserMonthlyHoursWorkflow.inputs.user_id,
    }
);

// ④ 投稿メッセージとして送信
UserMonthlyHoursWorkflow.addStep(
    Schema.slack.functions.SendMessage,
    {
        channel_id: UserMonthlyHoursWorkflow.inputs.channel_id,
        message: extractStep.outputs.user_summary,
    }
);

export default UserMonthlyHoursWorkflow;
