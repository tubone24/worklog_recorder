import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const WorkHoursRecordType = DefineType({
    name: "WorkHoursRecordType",
    title: "工数記録",
    description: "工数の記録情報（ID、作業時間、理由）",
    type: Schema.types.object,
    properties: {
        id: { type: Schema.types.string },
        hours: { type: Schema.types.number },
        reason: { type: Schema.types.string },
    },
    required: ["id", "hours", "reason"],
});
