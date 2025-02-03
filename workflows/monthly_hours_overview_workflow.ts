import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CalculateMonthlyHoursFunctionDefinition } from "../functions/calculate_monthly_hours_function.ts";
import { FormatMonthlySummaryFunctionDefinition } from "../functions/format_monthly_summary_function.ts";

const MonthlyHoursOverviewWorkflow = DefineWorkflow({
    callback_id: "monthly_hours_overview_workflow",
    title: "月の稼働工数確認（全ユーザー）",
    description: "指定月の全ユーザーの稼働時間を集計して表示する",
    input_parameters: {
        properties: {
            interactivity: { type: Schema.slack.types.interactivity },
            channel_id: { type: Schema.slack.types.channel_id },
        },
        required: ["interactivity", "channel_id"],
    },
});

// OpenFormステップを追加
const formStep = MonthlyHoursOverviewWorkflow.addStep(
    Schema.slack.functions.OpenForm,
    {
        title: "稼働時間集計期間の選択",
        interactivity: MonthlyHoursOverviewWorkflow.inputs.interactivity,
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

// 集計 Function を呼び出す
const calcStep = MonthlyHoursOverviewWorkflow.addStep(
    CalculateMonthlyHoursFunctionDefinition,
    {
        month: formStep.outputs.fields.target_month,
    }
);

// 集計結果をテキスト整形する
const formatStep = MonthlyHoursOverviewWorkflow.addStep(
    FormatMonthlySummaryFunctionDefinition,
    {
        user_hours: calcStep.outputs.user_hours,
        month: formStep.outputs.fields.target_month,
    }
);

// 結果を投稿
MonthlyHoursOverviewWorkflow.addStep(
    Schema.slack.functions.SendMessage,
    {
        channel_id: MonthlyHoursOverviewWorkflow.inputs.channel_id,
        message: formatStep.outputs.summary,
    }
);

export default MonthlyHoursOverviewWorkflow;
