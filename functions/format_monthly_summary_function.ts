import { SlackFunction, DefineFunction } from "deno-slack-sdk/mod.ts";

// 型定義を追加
interface HoursInfo {
    hours: string;
    reason: string;
}

interface UserHours {
    [key: string]: {
        [date: string]: HoursInfo;
    };
}

export const FormatMonthlySummaryFunctionDefinition = DefineFunction({
    callback_id: "format_monthly_summary_function",
    title: "集計結果の整形",
    description: "ユーザーごとの稼働時間一覧をテキストに整形する",
    source_file: "functions/format_monthly_summary_function.ts",
    input_parameters: {
        properties: {
            user_hours: { type: "object" },
            month: { type: "string" },
        },
        required: ["user_hours", "month"],
    },
    output_parameters: {
        properties: {
            summary: { type: "string" },
        },
        required: ["summary"],
    },
});

const FormatMonthlySummaryFunction = SlackFunction(
    FormatMonthlySummaryFunctionDefinition,
    async ({ inputs }) => {
        const { user_hours, month } = inputs;
        let summary = `*${month}の稼働時間サマリー* :calendar:\n\n`;

        // 型アサーションを追加
        const typedUserHours = user_hours as UserHours;

        for (const [user, hoursData] of Object.entries(typedUserHours)) {
            summary += `*<@${user}>の稼働記録*\n`;
            let totalHours = 0;

            const sortedDates = Object.entries(hoursData).sort(([a], [b]) => a.localeCompare(b));

            for (const [date, hoursInfo] of sortedDates) {
                const formattedDate = date.replace(/-/g, '/');
                summary += `• ${formattedDate}: \`${hoursInfo.hours}h\` :clock1: _(${hoursInfo.reason})_\n`;
                totalHours += parseFloat(hoursInfo.hours);
            }

            summary += `\n:bar_chart: *合計稼働時間: ${totalHours.toFixed(1)}h*\n\n`;
            summary += `---\n\n`;
            console.log(summary);
        }

        return { outputs: { summary } };
    }
);

export default FormatMonthlySummaryFunction;
