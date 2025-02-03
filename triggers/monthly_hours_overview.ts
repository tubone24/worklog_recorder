import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import MonthlyHoursOverviewWorkflow from "../workflows/monthly_hours_overview_workflow.ts";

const MonthlyHoursOverview: Trigger<typeof MonthlyHoursOverviewWorkflow.definition> = {
    type: TriggerTypes.Shortcut,
    name: "月稼働工数を計算する",
    description: "月稼働工数を計算する",
    workflow: `#/workflows/${MonthlyHoursOverviewWorkflow.definition.callback_id}`,
    inputs: {
        interactivity: {
            value: TriggerContextData.Shortcut.interactivity
        },
        channel_id: {
            value: TriggerContextData.Shortcut.channel_id
        },
    }
};

export default MonthlyHoursOverview;