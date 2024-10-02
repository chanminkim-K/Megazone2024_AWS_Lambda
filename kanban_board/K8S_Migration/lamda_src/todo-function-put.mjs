import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";  // UpdateCommand 사용

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "todo-db";  // DynamoDB 테이블 이름

export const handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  // 모든 도메인 허용
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {

        const id = event.pathParameters?.id;

        if (!id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: '경로에 id가 누락되었습니다.' }),
            };
        }

        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { title, category } = body;

        if (!title || !category) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'title 또는 category 값이 누락되었습니다.' }),
            };
        }

        const params = {
            TableName: tableName,
            Key: { id },  // 수정할 카드의 ID
            UpdateExpression: 'set title = :title, category = :category',
            ExpressionAttributeValues: {
                ':title': body.title,
                ':category': body.category,
            },
            ReturnValues: 'ALL_NEW',
        };


        const command = new UpdateCommand(params);
        const data = await dynamo.send(command);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data.Attributes),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: '카드를 업데이트할 수 없습니다.', details: error.message }),
        };
    }
};
