import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { isOwner } from "./authz";
import { jsonResponse } from "./http";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const SETTINGS_TABLE_NAME = process.env.SETTINGS_TABLE_NAME!;
const GLOBAL_SETTINGS_ID = "global";

interface AppSettings {
  introEnabled: boolean;
}

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (event) => {
  switch (event.routeKey) {
    case "GET /settings":
      return getSettings();
    case "PATCH /settings":
      return updateSettings(event);
    default:
      return jsonResponse(404, { error: "Not found" });
  }
};

// Readable by every signed-in user (Owner and Member alike) — the splash
// intro's kill switch needs every browser to be able to check it, not just
// the Owner's. Only the update below is Owner-restricted.
async function getSettings() {
  const result = await ddb.send(
    new GetCommand({ TableName: SETTINGS_TABLE_NAME, Key: { settingId: GLOBAL_SETTINGS_ID } })
  );
  const settings = result.Item as AppSettings | undefined;
  // No row yet = never configured — default to on.
  return jsonResponse(200, { introEnabled: settings?.introEnabled ?? true });
}

async function updateSettings(event: Parameters<APIGatewayProxyHandlerV2WithJWTAuthorizer>[0]) {
  if (!isOwner(event.requestContext.authorizer.jwt.claims)) {
    return jsonResponse(403, { error: "Owner only" });
  }

  let body: { introEnabled?: unknown };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }
  if (typeof body.introEnabled !== "boolean") {
    return jsonResponse(400, { error: "introEnabled must be a boolean" });
  }

  await ddb.send(
    new PutCommand({
      TableName: SETTINGS_TABLE_NAME,
      Item: { settingId: GLOBAL_SETTINGS_ID, introEnabled: body.introEnabled },
    })
  );
  return jsonResponse(200, { introEnabled: body.introEnabled });
}
