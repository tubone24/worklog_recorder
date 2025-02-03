import { Manifest } from "deno-slack-sdk/mod.ts";
import { WorkHoursRecord } from "./datastore.ts";
import RecordWorkHoursWorkflow from "./workflows/record_work_hours_workflow.ts";
import MonthlyHoursOverviewWorkflow from "./workflows/monthly_hours_overview_workflow.ts";
import UserMonthlyHoursWorkflow from "./workflows/user_monthly_hours_workflow.ts";
import DeleteWorkHoursWorkflow from "./workflows/delete_work_hours_workflow.ts";
import { WorkHoursRecordType } from "./types/work_hours_record_type.ts";

export default Manifest({
    name: "monthly-work-hours-app",
    description: "工数記録と月間稼働時間確認を行う Slack アプリです",
    icon: "assets/icon.png",
    types: [
        WorkHoursRecordType
    ],
    workflows: [
        RecordWorkHoursWorkflow,
        MonthlyHoursOverviewWorkflow,
        UserMonthlyHoursWorkflow,
        DeleteWorkHoursWorkflow,
    ],
    datastores: [WorkHoursRecord],
    outgoingDomains: [],
    botScopes: [
        "commands",
        "chat:write",
        "chat:write.public",
        "datastore:read",
        "datastore:write",
        "app_mentions:read",
        "channels:read"
    ],
});
