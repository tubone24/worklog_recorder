import { Trigger } from "deno-slack-sdk/types.ts";
import RecordWorkHoursWorkflow from "../workflows/record_work_hours_workflow.ts";
const RecordWorkHours: Trigger<
    typeof RecordWorkHoursWorkflow.definition
> = {
    type: "shortcut",
    name: "工数を記録する",
    description: "工数を記録する",
    workflow: "#/workflows/record_work_hours_workflow",
    inputs: {
        interactivity: {
            value: "{{data.interactivity}}",
        },
    },
};

export default RecordWorkHours;