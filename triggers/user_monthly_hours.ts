import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import UserMonthlyHoursWorkflow from "../workflows/user_monthly_hours_workflow.ts";

const UserMonthlyHours: Trigger<typeof UserMonthlyHoursWorkflow.definition> = {
    type: TriggerTypes.Shortcut,
    name: "月間稼働表を作成する",
    description: "月間稼働表を作成する",
    workflow: `#/workflows/${UserMonthlyHoursWorkflow.definition.callback_id}`,
    inputs: {
        interactivity: {
            value: TriggerContextData.Shortcut.interactivity
        },
        user_id: {
            value: TriggerContextData.Shortcut.user_id
        },
        channel_id: {
            value: TriggerContextData.Shortcut.channel_id
        },
    }
};

export default UserMonthlyHours;