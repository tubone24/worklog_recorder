import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const ExtractUserSummaryFunctionDefinition = DefineFunction({
    callback_id: "extract_user_summary_function",
    title: "ユーザーの稼働記録を抽出",
    source_file: "functions/extract_user_summary_function.ts",
    input_parameters: {
        properties: {
            summary: { type: Schema.types.string },
            user_id: { type: Schema.types.string },
        },
        required: ["summary", "user_id"],
    },
    output_parameters: {
        properties: {
            user_summary: { type: Schema.types.string },
        },
        required: ["user_summary"],
    },
});

const ExtractUserSummaryFunction = SlackFunction(
    ExtractUserSummaryFunctionDefinition,
    async ({ inputs }) => {
        const { summary, user_id } = inputs;

        // サマリーを行ごとに分割
        const lines = summary.split('\n');

        // ユーザーのセクションを見つける
        let isUserSection = false;
        let userSummary = [];

        for (const line of lines) {
            // ユーザーのセクション開始を検出
            if (line.includes(`<@${user_id}>`)) {
                isUserSection = true;
                userSummary.push(line);
                continue;
            }

            // 次のユーザーのセクション開始または最後の区切り線を検出
            if (line.includes('の稼働記録') && !line.includes(`<@${user_id}>`)) {
                isUserSection = false;
                continue;
            }

            // ユーザーのセクション内の行を追加
            if (isUserSection && line.trim() !== '') {
                userSummary.push(line);
            }
        }

        // ユーザーの記録が見つからない場合
        if (userSummary.length === 0) {
            return {
                outputs: {
                    user_summary: `<@${user_id}>の稼働記録は見つかりませんでした。`,
                },
            };
        }

        return {
            outputs: {
                user_summary: userSummary.join('\n'),
            },
        };
    }
);

export default ExtractUserSummaryFunction;
