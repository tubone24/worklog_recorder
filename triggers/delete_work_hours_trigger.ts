import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import DeleteWorkHoursWorkflow from "../workflows/delete_work_hours_workflow.ts";

const DeleteWorkHoursTrigger: Trigger<typeof DeleteWorkHoursWorkflow.definition> = {
    type: TriggerTypes.Shortcut,
    name: "工数記録を削除",
    description: "工数記録を削除します",
    workflow: `#/workflows/${DeleteWorkHoursWorkflow.definition.callback_id}`,
    inputs: {
        interactivity: {
            value: "{{data.interactivity}}"
        },
        user_id: {
            value: "{{data.user_id}}"
        },
    }
};

export default DeleteWorkHoursTrigger;