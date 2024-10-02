import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "todo-db";

export const handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  // 모든 도메인 허용
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {

        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;


        const params = {
            TableName: tableName,
            Item: {
                id: Math.round(Math.random() * 10000).toString(),
                title: body.title,
                category: body.category,
            },
        };

        const command = new PutCommand(params);
        await dynamo.send(command);

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify(params.Item),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: '카드를 생성할 수 없습니다.', details: error.message }),
        };
    }
};
