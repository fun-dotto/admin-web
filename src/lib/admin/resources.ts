import type { DescMessage, DescMethod, DescService } from "@bufbuild/protobuf";
import { AnnouncementService } from "#/api/admin/v1/announcement_pb";
import { CalendarDateService } from "#/api/admin/v1/calendar_date_pb";
import { CalendarService } from "#/api/admin/v1/calendar_pb";
import { CancelledClassService } from "#/api/admin/v1/cancelled_class_pb";
import { CourseRegistrationService } from "#/api/admin/v1/course_registration_pb";
import { FacultyService } from "#/api/admin/v1/faculty_pb";
import { FacultyRoomService } from "#/api/admin/v1/faculty_room_pb";
import { FareAttributeService } from "#/api/admin/v1/fare_attribute_pb";
import { FareRuleService } from "#/api/admin/v1/fare_rule_pb";
import { FcmTokenService } from "#/api/admin/v1/fcm_token_pb";
import { MakeupClassService } from "#/api/admin/v1/makeup_class_pb";
import { NotificationService } from "#/api/admin/v1/notification_pb";
import { NotificationTargetUserService } from "#/api/admin/v1/notification_target_user_pb";
import { RoomChangeService } from "#/api/admin/v1/room_change_pb";
import { RoomService } from "#/api/admin/v1/room_pb";
import { RoomReservationService } from "#/api/admin/v1/room_reservation_pb";
import { RouteService } from "#/api/admin/v1/route_pb";
import { StopService } from "#/api/admin/v1/stop_pb";
import { StopTimeService } from "#/api/admin/v1/stop_time_pb";
import { SubjectService } from "#/api/admin/v1/subject_pb";
import { SyllabusService } from "#/api/admin/v1/syllabus_pb";
import { TimetableItemService } from "#/api/admin/v1/timetable_item_pb";
import { TripService } from "#/api/admin/v1/trip_pb";
import { UserService } from "#/api/admin/v1/user_pb";
import { ZoneService } from "#/api/admin/v1/zone_pb";

export type ResourceOperation = "list" | "get" | "create" | "update" | "delete";

export type Resource = {
	slug: string;
	label: string;
	group: string;
	service: DescService;
};

export const resources: Resource[] = [
	{
		slug: "announcements",
		label: "お知らせ",
		group: "お知らせ・通知",
		service: AnnouncementService,
	},
	{
		slug: "notifications",
		label: "通知",
		group: "お知らせ・通知",
		service: NotificationService,
	},
	{
		slug: "notification-target-users",
		label: "通知対象ユーザー",
		group: "お知らせ・通知",
		service: NotificationTargetUserService,
	},
	{
		slug: "fcm-tokens",
		label: "FCM トークン",
		group: "お知らせ・通知",
		service: FcmTokenService,
	},
	{ slug: "subjects", label: "科目", group: "授業", service: SubjectService },
	{
		slug: "syllabi",
		label: "シラバス",
		group: "授業",
		service: SyllabusService,
	},
	{
		slug: "timetable-items",
		label: "時間割",
		group: "授業",
		service: TimetableItemService,
	},
	{
		slug: "cancelled-classes",
		label: "休講",
		group: "授業",
		service: CancelledClassService,
	},
	{
		slug: "makeup-classes",
		label: "補講",
		group: "授業",
		service: MakeupClassService,
	},
	{
		slug: "room-changes",
		label: "教室変更",
		group: "授業",
		service: RoomChangeService,
	},
	{
		slug: "course-registrations",
		label: "履修登録",
		group: "授業",
		service: CourseRegistrationService,
	},
	{
		slug: "faculties",
		label: "教員",
		group: "教員・教室",
		service: FacultyService,
	},
	{
		slug: "faculty-rooms",
		label: "教員研究室",
		group: "教員・教室",
		service: FacultyRoomService,
	},
	{ slug: "rooms", label: "教室", group: "教員・教室", service: RoomService },
	{
		slug: "room-reservations",
		label: "教室予約",
		group: "教員・教室",
		service: RoomReservationService,
	},
	{ slug: "routes", label: "路線", group: "バス", service: RouteService },
	{ slug: "stops", label: "停留所", group: "バス", service: StopService },
	{ slug: "trips", label: "便", group: "バス", service: TripService },
	{
		slug: "stop-times",
		label: "停車時刻",
		group: "バス",
		service: StopTimeService,
	},
	{
		slug: "calendars",
		label: "運行カレンダー",
		group: "バス",
		service: CalendarService,
	},
	{
		slug: "calendar-dates",
		label: "運行カレンダー例外日",
		group: "バス",
		service: CalendarDateService,
	},
	{
		slug: "fare-attributes",
		label: "運賃属性",
		group: "バス",
		service: FareAttributeService,
	},
	{
		slug: "fare-rules",
		label: "運賃ルール",
		group: "バス",
		service: FareRuleService,
	},
	{ slug: "zones", label: "ゾーン", group: "バス", service: ZoneService },
	{ slug: "users", label: "ユーザー", group: "ユーザー", service: UserService },
];

export function findResource(slug: string): Resource | undefined {
	return resources.find((resource) => resource.slug === slug);
}

const operationPrefixes: Record<ResourceOperation, string> = {
	list: "List",
	get: "Get",
	create: "Create",
	update: "Update",
	delete: "Delete",
};

export function findMethod(
	resource: Resource,
	operation: ResourceOperation,
): DescMethod | undefined {
	return resource.service.methods.find((method) =>
		method.name.startsWith(operationPrefixes[operation]),
	);
}

/** List レスポンスの repeated フィールドからリソース本体のメッセージ型を求める */
export function getEntityListField(resource: Resource) {
	const list = findMethod(resource, "list");
	return list?.output.fields.find(
		(field) => field.fieldKind === "list" && field.listKind === "message",
	);
}

export function getEntityMessage(resource: Resource): DescMessage | undefined {
	const field = getEntityListField(resource);
	return field?.fieldKind === "list" && field.listKind === "message"
		? field.message
		: undefined;
}
