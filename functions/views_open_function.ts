import { DefineFunction, SlackFunction, Schema } from "deno-slack-sdk/mod.ts";

// 関数の定義
export const ViewsOpenFunctionDefinition = DefineFunction({
    callback_id: "views_open",
    title: "モーダルビューを開く",
    description: "モーダルビューを開きます",
    source_file: "functions/views_open_function.ts",
    input_parameters: {
        properties: {
            interactivity: {
                type: Schema.slack.types.interactivity,
            },
            view: {
                type: Schema.types.object,
            },
        },
        required: ["interactivity", "view"],
    },
    output_parameters: {
        properties: {
            submitted_values: {
                type: Schema.types.object,
                description: "モーダルから送信された値"
            },
            interactivity: { type: Schema.slack.types.interactivity }
        },
        required: ["submitted_values", "interactivity"]
    }
});

export default SlackFunction(
    ViewsOpenFunctionDefinition,
    async ({ inputs, client }) => {
        try {
            await client.views.open({
                interactivity_pointer: inputs.interactivity.interactivity_pointer,
                view: {
                    ...inputs.view,
                    callback_id: "record_work_hours_modal"
                }
            });

            return { completed: false };
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
).addViewSubmissionHandler(
    "record_work_hours_modal",
    async ({ view, body }) => {
        console.log("ViewSubmissionHandler started");

        // 送信された値を適切な形式に変換
        const values = view.state.values;
        const submitted_values = {
            user_ids_block: {
                user_ids: values.user_ids_block.user_ids
            },
            hours_block: {
                hours: values.hours_block.hours
            },
            reason_block: {
                reason: values.reason_block.reason
            },
            work_date_block: {
                work_date: values.work_date_block.work_date
            }
        };

        // まずモーダルを閉じるレスポンスを返す
        return {
            response_action: "update",
            completed: true,
            outputs: {
                submitted_values: submitted_values,
                interactivity: body.interactivity
            }
        };
    }
);